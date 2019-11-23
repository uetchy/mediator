import { Filter } from "../ir";
import convert from "./adblock";

const source = [
  {
    name: "StackOverflow",
    rules: [
      {
        domain: "*stackexchange.com",
        type: "cosmetic",
        content: '.s-hero[class="test"][id="nice"]'
      },
      {
        domain: "*stackexchange.com",
        type: "cosmetic",
        content: "#js-gdpr-consent-banner"
      }
    ]
  }
] as Filter[];

const target = `! *** StackOverflow *** !
*stackexchange.com##.s-hero[class="test"][id="nice"]
*stackexchange.com###js-gdpr-consent-banner
`;

it("convert correctly", () => {
  const converted = convert(source);
  expect(converted).toEqual(target);
});
