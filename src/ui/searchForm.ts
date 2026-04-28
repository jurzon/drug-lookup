export function createSearchForm(onSubmit: (name: string) => void): HTMLFormElement {
  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');
  form.noValidate = true;

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'drug-name';
  input.className = 'search-input';
  input.placeholder = 'Enter drug name (e.g. ibuprofen)';
  input.autocomplete = 'off';
  input.setAttribute('aria-label', 'Drug name');

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'search-button';
  button.textContent = 'Search';

  form.append(input, button);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSubmit(input.value);
  });

  return form;
}
