import { Component, OnInit } from '@angular/core';
import { CountryVerificationService } from '../../services/country-verification/country-verification.service';
import { CountryPair } from '../../interfaces/country-pair';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
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

  }
}
