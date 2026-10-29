import indiaData from "./indiaLocationsData.json";

export interface IStateItem {
  name: string;
  isoCode: string;
  countryCode: string;
}

export interface ICityItem {
  name: string;
  countryCode: string;
  stateCode: string;
}

const statesList: IStateItem[] = (indiaData.states as { name: string; isoCode: string }[]).map(
  (s) => ({
    name: s.name,
    isoCode: s.isoCode,
    countryCode: "IN",
  })
);

const citiesMap: Record<string, ICityItem[]> = {};

for (const [stateCode, cityNames] of Object.entries(indiaData.citiesByState)) {
  citiesMap[stateCode] = (cityNames as string[]).map((name) => ({
    name,
    countryCode: "IN",
    stateCode,
  }));
}

export const State = {
  getStatesOfCountry: (countryCode?: string): IStateItem[] => {
    if (countryCode && countryCode !== "IN") return [];
    return statesList;
  },
  getStateByCodeAndCountry: (stateCode: string, countryCode?: string): IStateItem | undefined => {
    if (countryCode && countryCode !== "IN") return undefined;
    return statesList.find((s) => s.isoCode === stateCode);
  },
  getStateByCode: (stateCode: string): IStateItem | undefined => {
    return statesList.find((s) => s.isoCode === stateCode);
  },
};

export const City = {
  getCitiesOfState: (countryCode: string, stateCode: string): ICityItem[] => {
    if (countryCode !== "IN") return [];
    return citiesMap[stateCode] || [];
  },
  getCitiesOfCountry: (countryCode?: string): ICityItem[] => {
    if (countryCode && countryCode !== "IN") return [];
    return Object.values(citiesMap).flat();
  },
};

export default { State, City };

