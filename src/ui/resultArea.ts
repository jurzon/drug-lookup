import type { Drug } from '../types/drug.ts';
import { renderDrugCard } from './drugCard.ts';

export type ResultArea = {
  readonly element: HTMLElement;
  showIdle(): void;
  showLoading(): void;
  showError(message: string): void;
  showNotFound(query: string): void;
  showDrug(drug: Drug): void;
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
    showDrug(drug) {
      replace(renderDrugCard(drug));
    },
  };
}
