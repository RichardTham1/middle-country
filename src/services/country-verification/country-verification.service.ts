import { Injectable } from '@angular/core';
import { FeatureCollection, Feature, Point } from 'geojson';
import { environment } from '../../env/environment';
import { CountryPair } from '../../interfaces/country-pair';
import { CSVRow } from '../../interfaces/CSVRow';
import * as Papa from 'papaparse';
import * as turf from '@turf/turf';
import { LongLat } from '../../interfaces/longitude-latitude';
import { Polygon } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class CountryVerificationService {
  private geojsonData!: FeatureCollection;
  private initialized: Promise<void>;
  private countryLongLatData: Map<string, LongLat> = new Map(); 
  allCountries: string[] = [];
  constructor() {
    this.initialized = this.initializeService();
  }

  onInitialized(): Promise<void> {
    return this.initialized;
  }

  private async initializeService(): Promise<void> {
    return this.loadGeojson().then(() => {
      this.loadLongLat();
    });
  }

  private async loadGeojson(): Promise<void> {
    return fetch(`assets/countries.geojson`)
    .then(response => response.json())
    .then((data: FeatureCollection) => {
      this.geojsonData = data;
      console.log(this.geojsonData);
    }).finally(() => {
      this.loadCountries();
    })
    .catch(err => console.error('Failed to load GeoJSON', err));
  }

  loadCountries(): void {
    this.geojsonData?.features.forEach((feature: Feature) => {
      this.allCountries.push(feature.properties!['name']);
    })
    console.log(this.allCountries);
  }

  getRandomNumber(): number {
    return Math.floor(Math.random() * this.allCountries.length);
  }

  getTwoCountries(): CountryPair {
    let firstCountryIdx: number = this.getRandomNumber();
    let secondCountryIdx: number = this.getRandomNumber();
    while (secondCountryIdx == firstCountryIdx) {
      secondCountryIdx = this.getRandomNumber();
    }
    return {firstCountry: this.allCountries[firstCountryIdx], secondCountry: this.allCountries[secondCountryIdx]};
  }

  verifyCountry(answer: string): boolean {
    const country: LongLat | undefined = this.countryLongLatData.get(answer);
    if (country === undefined) return false;
    const point: Point = {
      type: 'Point',
      coordinates: [country.longitude, country.latitude]
    }
    return true;
  }

  private loadLongLat(): void {
    fetch('assets/country-coord.csv')
    .then(response => response.text())
    .then(csvData => {
      Papa.parse<CSVRow>(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: CSVRow[]; }) => {
          results.data.forEach((row: any) => {
            const country = row['Country'];
            const longitude = Number(row['Longitude (average)']);
            const latitude = Number(row['Latitude (average)']);
            this.countryLongLatData.set(country, { longitude, latitude });
          });
        },
        error: (error: Error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    })
    .catch(error => console.error('Error fetching CSV file:', error));
  }
}
