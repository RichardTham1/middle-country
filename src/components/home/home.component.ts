import { Component } from '@angular/core';
import { CountryVerificationService } from '../../services/country-verification/country-verification.service';
import { CountryPair } from '../../interfaces/country-pair';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  twoCountries: CountryPair | null = null;
  constructor(public countryVerificationService: CountryVerificationService) {}

  getTwoCountries(): void {
    this.twoCountries = this.countryVerificationService.getTwoCountries();
  }

  verifyAnswer() {

  }
}
