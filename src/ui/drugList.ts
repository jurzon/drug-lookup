import type { Drug } from '../types/drug.ts';

export function renderDrugList(
  drugs: Drug[],
  onSelect: (drug: Drug) => void,
  truncated: boolean,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'drug-list-wrap';

  const list = document.createElement('ul');
  list.className = 'drug-list';

  for (const drug of drugs) {
    list.append(renderItem(drug, onSelect));
  }

  wrap.append(list);

  if (truncated) {
    const more = document.createElement('p');
    more.className = 'drug-list__more';
    more.textContent = 'Showing top 10 results. Refine your search to see more.';
    wrap.append(more);
  }

  return wrap;
}

function renderItem(drug: Drug, onSelect: (drug: Drug) => void): HTMLElement {
  const item = document.createElement('li');
  item.className = 'drug-list__item';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'drug-list__button';
  button.addEventListener('click', () => onSelect(drug));

  const name = document.createElement('strong');
  name.className = 'drug-list__name';
  name.textContent = drug.genericName || 'Unknown drug';
  button.append(name);

  if (drug.brandNames.length > 0) {
    const brands = document.createElement('span');
    brands.className = 'drug-list__brands';
    for (const brand of drug.brandNames) {
      const chip = document.createElement('span');
      chip.className = 'brand-chip';
      chip.textContent = brand;
      brands.append(chip);
    }
    button.append(brands);
  }

  item.append(button);
  return item;
}
