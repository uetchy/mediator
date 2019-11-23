import { Filter, CosmeticRule, BlockRule } from "../ir";

interface OneBlockerRoot {
  name: string;
  rules: OneBlockerRule[];
  id: string;
}

interface OneBlockerRule {
  name: string;
  content: OneBlockerContent;
  id: string;
}

interface OneBlockerContent {
  trigger: OneBlockerTrigger;
  action: OneBlockerAction;
}

interface OneBlockerTrigger {
  "url-filter": string;
  "url-filter-is-case-sensitive": boolean;
  "if-domain"?: string[];
}

interface OneBlockerAction {
  type: "css-display-none" | "block";
  selector: string;
}

export default function parse(sourceString: string): Filter[] {
  const data = JSON.parse(sourceString) as OneBlockerRoot[];
  return data.map(filter => {
    let newRules = [];

    for (const rule of filter.rules) {
      const domain =
        rule.content.trigger?.["if-domain"]?.[0]?.replace(/^\*(?=\w)/, "*.") ??
        null;
      const ruleType = rule.content.action.type;

      switch (ruleType) {
        case "css-display-none":
          const elements = [];
          const selectors = rule.content.action.selector
            .split(",")
            .map(sel => sel.trim());
          for (const selector of selectors) {
            const newRule = {
              domain,
              type: "cosmetic",
              content: selector
            } as CosmeticRule;
            newRules.push(newRule);
          }
          break;
        case "block":
          const newRule = {
            domain,
            type: "block",
            content: rule.content.trigger["url-filter"]
          } as BlockRule;
          newRules.push(newRule);
          break;
        default:
          throw new Error("unknown action type: " + ruleType);
      }
    }

    return {
      name: filter.name,
      rules: newRules
    };
  });
}
