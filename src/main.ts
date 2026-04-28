import './style.css';
import { searchDrugsByPrefix, ValidationError, FetchError, ApiError } from './api/openFda.ts';
import type { Drug } from './types/drug.ts';
import { renderDisclaimer } from './ui/disclaimer.ts';
import { createSearchForm } from './ui/searchForm.ts';
import { createResultArea } from './ui/resultArea.ts';

const MIN_PREFIX_LENGTH = 3;
const SEARCH_LIMIT = 10;

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('#app element not found');
}

const heading = document.createElement('h1');
heading.textContent = 'DrugLookup';

const banner = renderDisclaimer();
const result = createResultArea();

let lastResults: Drug[] = [];
let lastTruncated = false;

const onSelect = (drug: Drug): void => {
  result.showDetail(drug, () => {
    result.showList(lastResults, onSelect, lastTruncated);
  });
};

const form = createSearchForm(async (raw) => {
  const name = raw.trim();
  if (name === '') {
    result.showError('Please enter a drug name.');
    return;
  }
  if (name.length < MIN_PREFIX_LENGTH) {
    result.showError(`Please enter at least ${MIN_PREFIX_LENGTH} characters.`);
    return;
  }

  result.showLoading();
  try {
    const drugs = await searchDrugsByPrefix(name, SEARCH_LIMIT);
    if (drugs.length === 0) {
      result.showNotFound(name);
      return;
    }
    lastResults = drugs;
    lastTruncated = drugs.length === SEARCH_LIMIT;
    result.showList(drugs, onSelect, lastTruncated);
  } catch (error) {
    if (error instanceof ValidationError) {
      result.showError('Please enter a drug name.');
    } else if (error instanceof FetchError) {
      result.showError('Network error — please check your connection and try again.');
    } else if (error instanceof ApiError) {
      result.showError(`Server error (${error.status}). Please try again later.`);
    } else {
      console.error(error);
      result.showError('Unexpected error — see browser console for details.');
    }
  }
});

app.replaceChildren(heading, banner, form, result.element);
