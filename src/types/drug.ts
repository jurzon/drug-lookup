export type OpenFdaDrugLabel = {
  id: string;
  set_id: string;
  indications_and_usage?: string[];
  warnings?: string[];
  adverse_reactions?: string[];
  dosage_and_administration?: string[];
  openfda: {
    generic_name?: string[];
    brand_name?: string[];
  };
};

export type Drug = {
  id: string;
  genericName: string;
  brandNames: string[];
  indicationsAndUsage?: string;
  warnings?: string;
  adverseReactions?: string;
  dosageAndAdministration?: string;
};

export function mapOpenFdaToDrug(raw: OpenFdaDrugLabel): Drug {
  return {
    id: raw.set_id,
    genericName: raw.openfda.generic_name?.[0] ?? '',
    brandNames: raw.openfda.brand_name ?? [],
    indicationsAndUsage: joinSection(raw.indications_and_usage),
    warnings: joinSection(raw.warnings),
    adverseReactions: joinSection(raw.adverse_reactions),
    dosageAndAdministration: joinSection(raw.dosage_and_administration),
  };
}

function joinSection(arr: string[] | undefined): string | undefined {
  if (!arr || arr.length === 0) return undefined;
  return arr.join('\n\n');
}
