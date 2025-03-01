import axios from "axios";
import { baseURL, Dog } from ".";
import { handleError } from "./auth";
import { NavigateFunction } from "react-router-dom";
import { Dispatch } from "redux";

interface DogSearchResponse {
  data: {
    resultIds: string[];
    total: number;
    next?: string;
    prev?: string;
  }
}

interface DogsResponse {
  data: Dog[];
}

export enum QueryType {
  'breeds' = 'breeds',
  'name' = 'name',
  'sort' = 'sort',
  'zipCodes' = 'zipCodes',
  'ageMin' = 'ageMin',
  'ageMax' = 'ageMax'
}

export enum SortType {
  breed = 'breed',
  name = 'name',
  age = 'age',
}

interface QueryParams {
  [QueryType.breeds]?: string[];
  [QueryType.ageMin]?: number;
  [QueryType.ageMax]?: number;
}

export async function getMatch(resultIds: string[]) {
  const matches = await axios.post(`${baseURL}/dogs/match`, resultIds, {
    withCredentials: true
  }).catch();
  return matches.data?.match as string;
}

export default async function search(
  navigate: NavigateFunction,
  dispatch: Dispatch,
  sortType: SortType = SortType.breed,
  sortOrder: 'asc' | 'desc' = 'asc',
  currentPage: number = 1,
  queryParams?: QueryParams
) {
  let totalPages = 10000;
  let resultIds = [] as string[];
  try {
      const response = await axios.get(`${baseURL}/dogs/search`, {
        params: {
          sort: `${sortType}:${sortOrder}`,
          size: 100,
          from: (currentPage - 1) * 100,
          ...queryParams,
        },
        withCredentials: true
      });
      resultIds = response.data.resultIds;
      totalPages = Math.ceil(response.data.total / 100);
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
  return { resultIds, totalPages };
}

export async function searchLocations(
  city?: string,
  states?: string[],
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: { lat: number; lon: number };
    top_right?: { lat: number; lon: number };
    bottom_right?: { lat: number; lon: number };
    top_left?: { lat: number; lon: number };
  },
  size: number = 25,
  from?: number
) {
  try {
    const response = await axios.post(`${baseURL}/locations/search`, {
      city,
      states,
      geoBoundingBox,
      size,
      from
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error searching locations:", error);
    throw error;
  }
}

export async function getAvailableBreeds(dispatch: Dispatch) {
  try {
    const breeds = (await axios.get<string[]>(`${baseURL}/dogs/breeds`, { withCredentials: true })).data;
    return breeds;
  } catch (error) {
    handleError(error, dispatch);
  }
  return [];
}