import { Filter } from "../ir";
import parse from "./1blocker";

const sourceString = `[{"id":"3BA4C368-0B64-4885-A83D-133ACB96056C","name":"StackOverflow","rules":[{"id":"C7ED7070-AC26-40A1-9159-473E1868D7E8","name":"Hero","content":{"trigger":{"if-domain":["*stackexchange.com","*stackoverflow.com"],"url-filter-is-case-sensitive":true,"url-filter":".*"},"action":{"type":"css-display-none","selector":".s-hero[class=\\"test\\"][id=\\"nice\\"], #js-gdpr-consent-banner"}}}]}]`;

const target = [
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

it("parse", () => {
  const parsed = parse(sourceString);
  expect(parsed).toStrictEqual(target);
});
