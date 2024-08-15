import { Injectable } from '@angular/core';
import { FeatureCollection, Feature } from 'geojson';
import { environment } from '../../env/environment';
@Injectable({
  providedIn: 'root'
})
export class CountryVerificationService {
  private geojsonData: FeatureCollection | null = null;
  constructor() {
    this.loadGeojson();
  }
  private loadGeojson() {
    fetch(`${environment.dev}/countries.geojson`)
    .then(response => {
      //console.log(response.json());
      return response.json();
    })
    .then((data: FeatureCollection) => {
      this.geojsonData = data;
    })
    .catch(err => console.error('Failed to load GeoJSON', err));
  }
}
