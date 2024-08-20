import { Component, HostListener, Input, NgModule, OnInit } from '@angular/core';
import { CountryVerificationService } from '../../services/country-verification/country-verification.service';
import { CountryPair } from '../../interfaces/country-pair';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  answer: string = '';
  twoCountries: CountryPair | null = null;
  constructor(public countryVerificationService: CountryVerificationService) {}

  ngOnInit(): void {
    this.countryVerificationService.onInitialized().then(() => {
      this.getTwoCountries();
    });
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
