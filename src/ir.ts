export interface Filter {
  name: string;
  rules: Rule[];
}

export type Rule = BlockRule | CosmeticRule;

interface BaseRule {
  type: string;
  domain: string | null;
}

export interface BlockRule extends BaseRule {
  type: "block";
  content: string;
}

export interface CosmeticRule extends BaseRule {
  type: "cosmetic";
  content: string;
}
