import {test} from "allure-playwright";
import {allureTestInfo} from "../utils/AllureHelper";
import {BaseStepsPage} from "../pages/baseSteps.page";
import {SearchFormPage} from "../pages/searchForm.page";
import {CalendarPage} from "../pages/calendar.page";
import {nextWeek, today} from "../utils/GetDate";

test.describe('Search form tests', () => {
  test('After starting the search on the /search page, the search form remains filled', async ({page}) => {
    await allureTestInfo({owner: "Egor Muratov", team: "Explore", feature: "Search form"});

    const baseStep = new BaseStepsPage(page)
    const searchForm = new SearchFormPage(page);
    const calendar = new CalendarPage(page);

    await baseStep.openPage('/');
    await searchForm.fillInOrigin({airportIata: 'VKO'});
    await searchForm.fillInDestination({cityIata: 'LED'});
    await searchForm.openCalendar();
    await calendar.selectTripDurationDates(today, nextWeek);
    await searchForm.selectNumberOfPassengerAndTripClass({adults: 3, children: 2, infant: 2, tripClass: 'C'});
    await searchForm.uncheckHotelCheckbox();
    await searchForm.startSearch();

    await baseStep.waitForUrl('**/search/*');
    await searchForm.assertThatDirectionIsEqualToExpected('VKO', "LED");
    await searchForm.assertThatStartDateIsEqualToExpected(today);
    await searchForm.assertThatEndDateIsEqualToExpected(nextWeek);
    await searchForm.assertThatNumberOfPassengersIsEqualToExpected(7)
    await searchForm.assertThatTripClassIsEqualToExpected('Бизнес');
    //todo add assertion for search results
  });

})
