import { Component, HostListener, Input, NgModule, OnInit } from '@angular/core';
import { CountryVerificationService } from '../../services/country-verification/country-verification.service';
import { CountryPair } from '../../interfaces/country-pair';
import { FormsModule } from '@angular/forms';

import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  control = new FormControl('');
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets!: Observable<string[]>;

  answer: string = '';
  twoCountries: CountryPair | null = null;
  constructor(public countryVerificationService: CountryVerificationService) {}

  ngOnInit(): void {
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.countryVerificationService.onInitialized().then(() => {
      this.getTwoCountries();
    });
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    console.log(this.filteredStreets)
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  getTwoCountries(): void {
    this.twoCountries = this.countryVerificationService.getTwoCountries();
  }

  verifyAnswer() {
    console.log(this.answer);
    this.countryVerificationService.verifyCountry(this.answer, this.twoCountries!);
  }

  @HostListener('keydown', ['$event'])
  keyHandler(event: KeyboardEvent) {
    const key = event.key.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    if (key === 'Enter') this.verifyAnswer();
  }
}
