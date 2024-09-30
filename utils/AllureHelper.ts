import * as allure from "allure-js-commons";

export async function allureTestInfo(param: { owner?: string, team?: string, feature?: string }) {
  const {owner, team, feature} = param;

  owner ? await allure.owner(owner) : null;
  team ? await allure.parameter("team", team) : null;
  feature ? await allure.feature(feature) : null;
}
