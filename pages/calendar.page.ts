import {Page} from "@playwright/test";
import * as allure from "allure-js-commons";
import {dateInCalendarFormat} from "../utils/DateFormarter";

export class CalendarPage {
  readonly calendarActionButton = this.page.getByTestId('calendar-action-button');
  readonly tabWeekends = this.page.getByTestId('tab-weekends');
  readonly toggleAllWeekends = this.page.getByTestId('select-all-weekends');
  readonly toggleAdditionalDays = this.page.getByTestId('select-additional-days');

  constructor(private readonly page: Page) {
  }

  readonly date = (date: string) => this.page.getByTestId(`date-${date}`)

  async selectTripDurationDates(startDate: Date, endDate?: Date) {
    await allure.step(`Selecting a departure date`, async () => {
      await this.chooseDate(startDate);
    });

    if (endDate) {
      await allure.step(`Selecting a return date`, async () => {
        await this.chooseDate(endDate);
      });
    } else {
      await allure.step('Click on the button ‘No return ticket needed"', async () => {
        await this.calendarActionButton.click()
      });
    }
  }

  async selectAllWeekends(additionalDays: boolean = false) {
    await allure.step('Select All Weekend', async () => {
      await allure.step('Switch to the ‘Weekend’ tab"', async () => {
        await this.tabWeekends.click();
      });

      await allure.step('Switch on the ‘All Weekend’ toggle', async () => {
        await this.toggleAllWeekends.click();
      });

      if (additionalDays) {
        await allure.step('Include the toggle ‘+ 1-2 days’.', async () => {
          await this.toggleAdditionalDays.click();
        });
      }

      await allure.step('Click on the ‘Select’ button', async () => {
        await this.calendarActionButton.click();
      });
    });
  }

  private async chooseDate(date: Date) {
    const dateInCalendar = dateInCalendarFormat(date);

    await allure.step(`Select a date ${dateInCalendar}`, async () => {
      await this.date(dateInCalendar).hover();
      await this.date(dateInCalendar).click();
    });
  }
}
