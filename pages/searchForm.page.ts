import {expect, Page} from "@playwright/test";
import * as allure from "allure-js-commons";
import {dateInSearchForm} from "../utils/DateFormarter";

export class SearchFormPage {
  readonly searchForm = this.page.getByTestId('avia-form');
  readonly originInput = this.page.getByTestId('origin-input');
  readonly destinationInput = this.page.getByTestId('destination-input');
  readonly formSubmitButton = this.page.getByTestId('form-submit');
  readonly suggestedAnywhere = this.page.getByTestId('suggested-anywhere');
  readonly suggestedWeekend = this.page.getByTestId('suggested-weekend');
  readonly suggestedHotTickets = this.page.getByTestId('suggested--hot-tickets');
  readonly startDateInput = this.page.getByTestId('start-date-field');
  readonly startDateValue = this.page.getByTestId('start-date-value');
  readonly endDateValue = this.page.getByTestId('end-date-value');
  readonly hotelCheckbox = this.page.getByTestId('checkbox');
  readonly passengersField = this.page.getByTestId('passengers-field');
  readonly passengerNumbers = this.page.getByTestId('passenger-numbers');
  readonly tripClass = this.page.getByTestId('trip-class');
  readonly multiwaySearchFormButton = this.page.getByTestId('switch-to-multiwayform');
  readonly originIata = this.page.locator(`xpath=//*[@data-test-id="origin-input"]/following-sibling::*[@data-test-id="iata"]`)
  readonly destinationIata = this.page.locator(`xpath=//*[@data-test-id="destination-input"]/following-sibling::*[@data-test-id="iata"]`)

  constructor(private readonly page: Page) {}

  readonly suggestedCity = (city: string) => this.page.getByTestId(`suggested-city-${city}`);
  readonly suggestedAirport = (airport: string) => this.page.getByTestId(`suggested-airport-${airport}`);
  readonly suggestedCountry = (country: string) => this.page.getByTestId(`suggested-country-${country}`);
  readonly numberOfPassengerBlock = (passengerType: string) => this.page.getByTestId(`number-of-${passengerType}`);
  readonly increaseButton = (passengerType: string) => this.numberOfPassengerBlock(passengerType).getByTestId('increase-button');
  readonly tripClassInput = (tripClass: string) => this.page.locator(`xpath=//*[@data-test-id="trip-class-${tripClass}"]/parent::label`)

  async fillInOrigin(param: { cityIata?: string, airportIata?: string }) {
    const {cityIata, airportIata} = param;

    if (cityIata) {
      await allure.step(`Type ${cityIata} in the ‘Origin’ field`, async () => {
        await this.originInput.fill(cityIata);
        await this.suggestedCity(cityIata).click();
      });
    }

    if (airportIata) {
      await allure.step(`Type ${airportIata} in the ‘Origin’ field`, async () => {
        await this.originInput.fill(airportIata);
        await this.suggestedAirport(airportIata).click();
      });
    }
  }

  async fillInDestination(param: {
    cityIata?: string,
    airportIata?: string,
    countryCode?: string,
    isAnywhere?: boolean,
    isWeekend?: boolean,
    isHotTickets?: boolean
  }) {
    const {cityIata, airportIata, countryCode, isAnywhere, isWeekend, isHotTickets} = param;

    if (cityIata) {
      await allure.step(`Type ${cityIata} in the 'Destination' field`, async () => {
        await this.destinationInput.fill(cityIata);
        await this.suggestedCity(cityIata).click();
      });
    }

    if (airportIata) {
      await allure.step(`Type ${airportIata} in the 'Destination' field`, async () => {
        await this.destinationInput.fill(airportIata);
        await this.suggestedAirport(airportIata).click();
      });
    }

    if (countryCode) {
      await allure.step(`Type ${countryCode} in the 'Destination' field`, async () => {
        await this.destinationInput.fill(countryCode);
        await this.suggestedCountry(countryCode).click();
      });
    }

    if (isAnywhere) {
      await allure.step(`Type ‘Anywhere’ in the 'Destination' field`, async () => {
        await this.destinationInput.fill('anywhere');
        await this.suggestedAnywhere.click();
      });
    }

    if (isWeekend) {
      await allure.step(`Type ‘Weekends’ in the 'Destination' field`, async () => {
        await this.destinationInput.fill('weekend');
        await this.suggestedWeekend.click();
      });
    }

    if(isHotTickets) {
      await allure.step(`Type ‘Hot Tickets’ in the 'Destination' field`, async () => {
        await this.destinationInput.fill('hot tickets');
        await this.suggestedHotTickets.click();
      });
    }
  }

  async openCalendar() {
    await allure.step('Open a calendar', async () => {
      await this.startDateInput.click();
    });
  }

  async selectNumberOfPassengerAndTripClass(param: {
    children: number;
    adults: number;
    infant: number,
    tripClass: string
  }) {
    const {adults, children, infant, tripClass} = param;
    await allure.step(`Select the number of passengers: adults - ${adults}, children - ${children}, infants - ${infant}, trip class - ${tripClass}`, async () => {
      await this.passengersField.click();

      if (adults) {
        await this.addPassenger('adults', adults - 1);
      }

      if (children) {
        await this.addPassenger('children', children);
      }

      if (infant) {
        await this.addPassenger('infants', infant);
      }

      if (tripClass) {
        await this.tripClassInput(tripClass).click();
      }

      await this.passengersField.click();
    });
  }

  async waitForSearchFormToLoad(isDestination: boolean = false) {
    await allure.step('Wait until the search form is fully loaded', async () => {
      await expect(this.searchForm).toBeVisible();
      await expect(this.formSubmitButton).toBeEnabled();
      await expect(this.originInput).toHaveAttribute('value');

      if (isDestination) {
        await expect(this.destinationInput).toHaveAttribute('value');
      }
      //todo remove it later
      await this.page.waitForTimeout(500);
    });
  }

  async assertThatOriginIsEqualToExpected(expectedOrigin: string) {
    await allure.step(`The ‘Origin’ field contains: value : ${expectedOrigin}`, async () => {
      const originInputValue = await this.originInput.getAttribute('value');
      expect(originInputValue).toEqual(expectedOrigin);
    });
  }

  async assertThatDestinationIsEqualToExpected(expectedDestination: string) {
    await allure.step(`The ‘Destination’ field contains: value : ${expectedDestination}`, async () => {
      const destinationInputValue = await this.destinationInput.getAttribute('value');
      expect(destinationInputValue).toEqual(expectedDestination);
    });
  }

  async uncheckHotelCheckbox() {
    await allure.step('Uncheck the hotel checkbox', async () => {
      await this.hotelCheckbox.click();
    });
  }

  async startSearch() {
    await allure.step('Start a search', async () => {
      await this.formSubmitButton.click();
    });
  }

  async assertThatDirectionIsEqualToExpected(origin: string, destination: string) {
    await allure.step(`The ‘Origin’ field is ${origin} and the ‘Destination’ field is ${destination}`, async () => {
      await expect(this.originIata).toHaveText(origin);
      await expect(this.destinationIata).toHaveText(destination);
    });
  }

  async assertThatStartDateIsEqualToExpected(date: Date) {
    const startDate = dateInSearchForm(date)
    await allure.step(`Start date is equal to: ${startDate}`, async () => {
      const startDateValue = await this.startDateValue.textContent();
      expect(startDateValue).toContain(startDate);
    });
  }

  async assertThatEndDateIsEqualToExpected(date: Date) {
    const endDate = dateInSearchForm(date)
    await allure.step(`End date is equal to: ${endDate}`, async () => {
      const endDateValue = await this.endDateValue.textContent();
      expect(endDateValue).toContain(endDate);
    });
  }

  async assertThatNumberOfPassengersIsEqualToExpected(number: number) {
    await allure.step(`The number of passengers is equal to: ${number}`, async () => {
      const passengerNumbers = parseInt(await this.passengerNumbers.textContent());
      expect(passengerNumbers).toEqual(number);
    });
  }

  async assertThatTripClassIsEqualToExpected(expectedTripClass: string) {
    await allure.step(`Trip class  is equal to: ${expectedTripClass}`, async () => {
      const tripClass = await this.tripClass.textContent();
      expect(tripClass).toEqual(expectedTripClass);
    });
  }

  async switchToMultiwaySearchForm() {
    await allure.step('Switch to multiway search form', async () => {
      await this.multiwaySearchFormButton.click();
    });
  }

  private async addPassenger(passengerType: string, count: number) {
    await allure.step(`Add ${passengerType === 'adults' ? count + 1 : count} of passengers of type ${passengerType}`, async () => {
      for (let i = 0; i < count; i++) {
        await this.increaseButton(passengerType).click();
      }
    });
  }

}
