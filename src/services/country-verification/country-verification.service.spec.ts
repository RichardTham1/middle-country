import { TestBed } from '@angular/core/testing';

import { CountryVerificationService } from './country-verification.service';

describe('CountryVerificationService', () => {
  let service: CountryVerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryVerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
