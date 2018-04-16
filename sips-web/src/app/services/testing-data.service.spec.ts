import { TestBed, inject } from '@angular/core/testing';

import { TestingDataService } from './testing-data.service';

describe('TestingDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestingDataService]
    });
  });

  it('should be created', inject([TestingDataService], (service: TestingDataService) => {
    expect(service).toBeTruthy();
  }));
});
