import { Injectable } from '@angular/core';
import { FeatureCollection, Feature } from 'geojson';
import { environment } from '../../env/environment';
import { CountryPair } from '../../interfaces/country-pair';
@Injectable({
  providedIn: 'root'
})
export class CountryVerificationService {
  private geojsonData: FeatureCollection | null = null;
  allCountries: string[] = [];
  constructor() {
    this.loadGeojson();
  }
  private loadGeojson(): void {
    fetch(`assets/countries.geojson`)
    .then(response => response.json())
    .then((data: FeatureCollection) => {
      this.geojsonData = data;
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

  verifyCountry() {
    
  }
}
