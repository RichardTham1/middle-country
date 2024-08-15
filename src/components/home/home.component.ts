import { Component } from '@angular/core';
import { CountryVerificationService } from '../../services/country-verification/country-verification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(countryVerificationService: CountryVerificationService) {}
}
