import { Injectable } from '@angular/core';
import { FeatureCollection, Feature, Point, Geometry } from 'geojson';
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
    this.allCountries.push('Body of Water');
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
    return { firstCountry: this.allCountries[firstCountryIdx], secondCountry: this.allCountries[secondCountryIdx] };
  }

  verifyCountry(answer: string, countries: CountryPair): boolean {
    let expectedAnswer: string = '';

    // Besoin de calculer la distance entre deux longitudes latitude pour ensuite
    const firstCountryLongLat: LongLat | undefined = this.countryLongLatData.get(countries.firstCountry);
    const secondCountryLongLat: LongLat | undefined = this.countryLongLatData.get(countries.secondCountry);
    const middleLong: number = (firstCountryLongLat!.longitude + secondCountryLongLat!.longitude) / 2;
    const middleLat: number = (firstCountryLongLat!.latitude + secondCountryLongLat!.latitude) / 2;
    const midPoint: Point = {
      type: 'Point',
      coordinates: [middleLong, middleLat]
    };
    for (const feature of this.geojsonData.features) {
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        const polygon = feature.geometry;
        const isInside = turf.booleanPointInPolygon(midPoint, polygon);
        if (isInside) {
          expectedAnswer = feature.properties!['name'];
          break;
        }
      }
    }
    if (expectedAnswer === '') expectedAnswer = 'Body of Water';
    return answer == expectedAnswer;
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
