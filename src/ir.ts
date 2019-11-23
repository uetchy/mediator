export interface Filter {
  name: string;
  rules: Rule[];
}

export type Rule = BlockRule | CosmeticRule;

export interface BlockRule {
  type: "block";
  domain: string;
  content: string;
}

export interface CosmeticRule {
  type: "cosmetic";
  domain: string;
  content: Element[];
}

export interface Element {
  name: string;
  attributes: Record<string, string>;
}
