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
      const domain = rule.content.trigger?.["if-domain"]?.[0] ?? "*";
      const ruleType = rule.content.action.type;

      switch (ruleType) {
        case "css-display-none":
          const elements = [];
          for (const element of rule.content.action.selector.split(",")) {
            const match = element.match(
              /((([\w-]+)|(\.[\w-]+)|(\#[\w-]+)|\*)(\[(.+(=".+"|\*".+"|\^".+"|))\])?(::|:)? *(,|<|>| |\+|~|-|)? *){1,}/
            );
            if (!match) {
              continue;
            }
            const name = match[3] ?? "div";
            const attributes = {} as Record<string, string>;
            if (match[4]) {
              attributes.class = match[4].slice(1);
            }
            if (match[5]) {
              attributes.id = match[5].slice(1);
            }
            if (match[6]) {
              for (const attrMatch of match[6].matchAll(
                /\[([a-zA-Z0-9-]+?)="(.+?)"\]/g
              )) {
                if (attrMatch[1] === "class") {
                  attributes[attrMatch[1]] =
                    (attributes[attrMatch[1]] ?? "") + " " + attrMatch[2];
                } else {
                  attributes[attrMatch[1]] = attrMatch[2];
                }
              }
            }
            elements.push({
              name,
              attributes
            });
          }
          const newRule = {
            domain,
            type: "cosmetic",
            content: elements
          } as CosmeticRule;
          newRules.push(newRule);
          break;
        case "block":
          newRules.push({
            domain,
            type: "block",
            content: rule.content.trigger["url-filter"]
          } as BlockRule);
          break;
        default:
          throw new Error("unknown action type");
      }
    }

    return {
      name: filter.name,
      rules: newRules
    };
  });
}
