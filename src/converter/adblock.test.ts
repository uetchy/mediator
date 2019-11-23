import { Filter } from "../ir";
import convert from "./adblock";

const source = [
  {
    name: "StackOverflow",
    rules: [
      {
        domain: "*stackexchange.com",
        type: "cosmetic",
        content: [
          {
            name: "div",
            attributes: {
              class: "s-hero test",
              id: "nice"
            }
          },
          {
            name: "div",
            attributes: {
              id: "js-gdpr-consent-banner"
            }
          }
        ]
      }
    ]
  }
] as Filter[];

const target = `! *** StackOverflow *** !
*stackexchange.com##DIV[class="s-hero test"][id="nice"]
*stackexchange.com##DIV[id="js-gdpr-consent-banner"]
`;

it("convert correctly", () => {
  const converted = convert(source);
  expect(converted).toEqual(target);
});
