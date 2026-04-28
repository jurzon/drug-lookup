import type { Drug } from '../types/drug.ts';
import { renderDrugCard } from './drugCard.ts';
import { renderDrugList } from './drugList.ts';

export type ResultArea = {
  readonly element: HTMLElement;
  showIdle(): void;
  showLoading(): void;
  showError(message: string): void;
  showNotFound(query: string): void;
  showList(drugs: Drug[], onSelect: (drug: Drug) => void, truncated: boolean): void;
  showDetail(drug: Drug, onBack: () => void): void;
};

export function createResultArea(): ResultArea {
  const element = document.createElement('div');
  element.className = 'result-area';
  element.setAttribute('aria-live', 'polite');

  function replace(child: Node | null): void {
    if (child === null) {
      element.replaceChildren();
    } else {
      element.replaceChildren(child);
    }
  }

  function message(text: string, modifier: 'error' | 'loading' | 'info'): HTMLElement {
    const p = document.createElement('p');
    p.className = `message message--${modifier}`;
    p.textContent = text;
    return p;
  }

  function detailView(drug: Drug, onBack: () => void): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'detail-view';

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'back-button';
    back.textContent = '← Back to results';
    back.addEventListener('click', onBack);

    wrap.append(back, renderDrugCard(drug));
    return wrap;
  }

  return {
    element,
    showIdle() {
      replace(null);
    },
    showLoading() {
      replace(message('Loading…', 'loading'));
    },
    showError(text) {
      replace(message(text, 'error'));
    },
    showNotFound(query) {
      replace(message(`No results for "${query}".`, 'info'));
    },
    showList(drugs, onSelect, truncated) {
      replace(renderDrugList(drugs, onSelect, truncated));
    },
    showDetail(drug, onBack) {
      replace(detailView(drug, onBack));
    },
  };
}
