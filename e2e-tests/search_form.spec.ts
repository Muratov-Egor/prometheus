import {test} from "allure-playwright";
import {allureTestInfo} from "../utils/AllureHelper";
import {BaseSteps} from "../pages/BasePage";

test.describe('Search form tests', () => {
  test('After starting the search on the /search page, the search form remains filled', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "Search form"});

    const baseStep = new BaseSteps(page)

    await baseStep.openPage('/');

  });

})
