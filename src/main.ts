import './style.css';
import { searchDrugByName, ValidationError, FetchError, ApiError } from './api/openFda.ts';
import { renderDisclaimer } from './ui/disclaimer.ts';
import { createSearchForm } from './ui/searchForm.ts';
import { createResultArea } from './ui/resultArea.ts';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('#app element not found');
}

const heading = document.createElement('h1');
heading.textContent = 'DrugLookup';

const banner = renderDisclaimer();
const result = createResultArea();

const form = createSearchForm(async (raw) => {
  const name = raw.trim();
  if (name === '') {
    result.showError('Please enter a drug name.');
    return;
  }

  result.showLoading();
  try {
    const drug = await searchDrugByName(name);
    if (drug === null) {
      result.showNotFound(name);
    } else {
      result.showDrug(drug);
    }
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
