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

export async function searchDrugsByPrefix(prefix: string, limit = 10): Promise<Drug[]> {
  const trimmed = prefix.trim();
  if (trimmed === '') {
    throw new ValidationError('prefix must not be empty');
  }

  // Append the literal `*` AFTER escape+encode so it stays unescaped in the URL.
  // No quote-wrapping: Lucene does not expand wildcards inside a quoted phrase.
  // The surrounding query syntax (+OR+, :, parens) must stay literal — see fix d477d41.
  const encoded = encodeURIComponent(escapeLucene(trimmed));
  const wildcard = `${encoded}*`;
  const search = `(openfda.generic_name:${wildcard}+OR+openfda.brand_name:${wildcard})`;
  const url = `${ENDPOINT}?search=${search}&limit=${limit}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (cause) {
    throw new FetchError('network request to openFDA failed', { cause });
  }

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new ApiError(`openFDA request failed with status ${response.status}`, {
      status: response.status,
      body,
    });
  }

  const data = (await response.json()) as OpenFdaResponse;
  const raw = data.results ?? [];

  // Dedupe by set_id (Drug.id). Same label record can appear more than once when
  // both generic_name and brand_name match the prefix.
  const byId = new Map<string, Drug>();
  for (const item of raw) {
    const drug = mapOpenFdaToDrug(item);
    if (!byId.has(drug.id)) {
      byId.set(drug.id, drug);
    }
  }
  return Array.from(byId.values());
}
