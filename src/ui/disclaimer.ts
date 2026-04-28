export function renderDisclaimer(): HTMLElement {
  const banner = document.createElement('aside');
  banner.className = 'disclaimer-banner';
  banner.setAttribute('role', 'note');
  banner.setAttribute('aria-label', 'Educational disclaimer');

  const sourceNote = document.createElement('p');
  sourceNote.textContent =
    'Drug data is sourced from US authorities (FDA / NIH) and may not match drug registrations in Slovakia or other countries.';

  const educationalNote = document.createElement('p');
  educationalNote.textContent =
    'This is an educational tool. It is not a substitute for AISLP / ŠÚKL or professional medical consultation.';

  banner.append(sourceNote, educationalNote);
  return banner;
}
