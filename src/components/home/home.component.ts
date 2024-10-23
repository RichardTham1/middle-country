import { Component, HostListener, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { CountryVerificationService } from '../../services/country-verification/country-verification.service';
import { CountryPair } from '../../interfaces/country-pair';
import { FormsModule } from '@angular/forms';
import { CounterComponent } from "../counter/counter.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CounterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild(CounterComponent) counterComponent!: CounterComponent;
  filteredCountry: string[] = [];
  answer: string = '';
  twoCountries: CountryPair | null = null;
  constructor(public countryVerificationService: CountryVerificationService) { }

  ngOnInit(): void {
    this.countryVerificationService.onInitialized().then(() => {
      this.getTwoCountries();
    });
  }

  updatelist(event: string) {
    this.filteredCountry = this._filter(event);
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.countryVerificationService.allCountries.filter(country => this._normalizeValue(country).startsWith(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  getTwoCountries(): void {
    this.twoCountries = this.countryVerificationService.getTwoCountries();
  }

  verifyAnswer() {
    const res: boolean = this.countryVerificationService.verifyCountry(this.answer, this.twoCountries!);
    if (res) {
      this.counterComponent.incrementRight();
      this.getTwoCountries();
    } else {
      this.counterComponent.incrementWrong();
    }
    this.filteredCountry = [];
  }

  @HostListener('keydown', ['$event'])
  keyHandler(event: KeyboardEvent) {
    const key = event.key.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    if (key === 'Enter') {
      this.verifyAnswer();
      this.answer = '';
    }
  }
}
