import { Filter } from "../ir";

// ! *** niconico *** !
// www.nicovideo.jp##DIV[class="MarqueeContainer"]
// www.nicovideo.jp##DIV[class="SwitchToFlashLead   WatchAppContainer-switchToFlash"]
// www.nicovideo.jp##DIV[class="PreVideoStartPremiumLinkContainer"]
// www.nicovideo.jp##A[id="siteHeaderNotificationPremium"][class="siteHeaderUpgrade"]
// www.nicovideo.jp##DIV[class="NicoSpotAdContainer"]
// www.nicovideo.jp##A[class="regist"]
// www.nicovideo.jp##DIV[class="GridCell BottomContainer-side"]

// ! *** pixiv *** !
// www.pixiv.net##A[class="pay-button"]
// www.pixiv.net##SECTION[class="ad"]
// www.pixiv.net##DIV[class="rounded"]

// ! *** raindrop.io *** !
// raindrop.io##A[class="proAccountBlock"]
// raindrop.io##A[class="proAccountBlock"]
// raindrop.io##A[class="proAccountBlock"]

export default function convert(filters: Filter[]): string {
  let data: string = "";
  for (const filter of filters) {
    data += `! *** ${filter.name} *** !\n`;
    for (const rule of filter.rules) {
      switch (rule.type) {
        case "cosmetic":
          for (const element of rule.content) {
            data += `${rule.domain}##${element.name.toUpperCase()}`;
            for (const key in element.attributes) {
              data += `[${key}="${element.attributes[key]}"]`;
            }
            data += "\n";
          }
          break;
        case "block":
          data += `||${rule.content}^\n`;
      }
    }
  }
  return data;
}
