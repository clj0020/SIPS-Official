import { TestBed, inject } from '@angular/core/testing';

import { MachineLearnerService } from './machine-learner.service';

describe('MachineLearnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineLearnerService]
    });
  });

  it('should be created', inject([MachineLearnerService], (service: MachineLearnerService) => {
    expect(service).toBeTruthy();
  }));
});
