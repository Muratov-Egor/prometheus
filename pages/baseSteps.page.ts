import * as allure from "allure-js-commons";
import {expect, Page} from "@playwright/test";

export class BaseStepsPage {
  constructor(private readonly page: Page) {
  }

  async openPage(url: string) {
    await allure.step(`Open page: ${url}`, async () => {
      await this.page.goto(url, {waitUntil: "load"});
    });
  }

  async overrideFrontEndFlagr({flagName, flagOptions, isFirstQueryParam = true}: {
    flagName: string,
    flagOptions?: object,
    isFirstQueryParam?: boolean
  }) {
    return await allure.step(`Flag override: ${flagName}}`,
      async () => {
        const overrideFlag = isFirstQueryParam ? `?ffv2_overrides=` : `&ffv2_overrides=`

        return `${overrideFlag}{"${flagName}":${JSON.stringify(flagOptions)}}`
      });
  }

  async waitForUrl(url: string) {
    await allure.step(`Waiting to go to a page: ${url}`, async () => {
      await this.page.waitForURL(url, {waitUntil: "load", timeout: 50000});
    });
  }

  async assertThatCookieExists(cookieName: string, expiresHours: number) {
    const cookie = await this.page.context().cookies();
    const targetCookie = cookie.find(c => c.name === cookieName);

    // Check that the cookie exists
    await allure.step(`Check that the cookie ${cookieName} exists`, async () => {
      expect(targetCookie).toBeDefined();
    });

    // Retrieve the expires value
    const expiresTime = new Date(targetCookie.expires * 1000);
    const currentTime = new Date();

    // Calculate the time difference between expires and current time
    const timeDifferenceInHours = (expiresTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

    // Check that the lifetime of the cookie is expiresHours hours (taking into account possible error)
    await allure.step(`Check that the cookie ${cookieName} expires in ${expiresHours} hours`, async () => {
      expect(timeDifferenceInHours).toBeCloseTo(expiresHours, 0.5);
    });
  }
}
