import { TestBed, inject } from '@angular/core/testing';

import { InjuryService } from './injury.service';

describe('InjuryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InjuryService]
    });
  });

  it('should be created', inject([InjuryService], (service: InjuryService) => {
    expect(service).toBeTruthy();
  }));
});
