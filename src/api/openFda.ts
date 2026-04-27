import { mapOpenFdaToDrug, type Drug, type OpenFdaDrugLabel } from '../types/drug.ts';

const ENDPOINT = 'https://api.fda.gov/drug/label.json';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class FetchError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'FetchError';
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, info: { status: number; body: string }) {
    super(message);
    this.name = 'ApiError';
    this.status = info.status;
    this.body = info.body;
  }
}

type OpenFdaResponse = {
  results?: OpenFdaDrugLabel[];
};

// Lucene reserved characters that must be backslash-escaped inside a phrase.
// && and || become \&\& and \|\| naturally because each char is escaped.
const LUCENE_SPECIAL = /([+\-!(){}\[\]^"~*?:\\/&|])/g;

function escapeLucene(value: string): string {
  return value.replace(LUCENE_SPECIAL, '\\$1');
}

export async function searchDrugByName(name: string): Promise<Drug | null> {
  const trimmed = name.trim();
  if (trimmed === '') {
    throw new ValidationError('name must not be empty');
  }

  const phrase = `"${escapeLucene(trimmed)}"`;
  const search = `(openfda.generic_name:${phrase}+OR+openfda.brand_name:${phrase})`;
  const url = `${ENDPOINT}?search=${encodeURIComponent(search)}&limit=1`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (cause) {
    throw new FetchError('network request to openFDA failed', { cause });
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new ApiError(`openFDA request failed with status ${response.status}`, {
      status: response.status,
      body,
    });
  }

  const data = (await response.json()) as OpenFdaResponse;
  const first = data.results?.[0];
  if (!first) {
    return null;
  }

  return mapOpenFdaToDrug(first);
}
