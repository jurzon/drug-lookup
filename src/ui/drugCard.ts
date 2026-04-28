import type { Drug } from '../types/drug.ts';

export function renderDrugCard(drug: Drug): HTMLElement {
  const card = document.createElement('article');
  card.className = 'drug-card';

  const title = document.createElement('h2');
  title.className = 'drug-card__title';
  title.textContent = drug.genericName || 'Unknown drug';
  card.append(title);

  if (drug.brandNames.length > 0) {
    card.append(renderBrandList(drug.brandNames));
  }

  if (drug.indicationsAndUsage !== undefined) {
    card.append(renderSection('Indications and usage', drug.indicationsAndUsage));
  }

  if (drug.warnings !== undefined) {
    card.append(renderSection('Warnings', drug.warnings));
  }

  const footer = document.createElement('footer');
  footer.className = 'drug-card__disclaimer';
  footer.textContent =
    'Source: openFDA. Educational use only — not a substitute for AISLP / ŠÚKL or medical consultation.';
  card.append(footer);

  return card;
}

function renderBrandList(names: string[]): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'drug-card__brands';

  const label = document.createElement('span');
  label.className = 'drug-card__brands-label';
  label.textContent = 'Brand names:';
  wrap.append(label);

  for (const name of names) {
    const chip = document.createElement('span');
    chip.className = 'brand-chip';
    chip.textContent = name;
    wrap.append(chip);
  }

  return wrap;
}

function renderSection(title: string, body: string): HTMLElement {
  const section = document.createElement('section');
  section.className = 'drug-card__section';

  const heading = document.createElement('h3');
  heading.textContent = title;

  const para = document.createElement('p');
  para.textContent = body;

  section.append(heading, para);
  return section;
}
