import { TestBed, inject } from '@angular/core/testing';

import { TestTypeService } from './test-type.service';

describe('TestTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestTypeService]
    });
  });

  it('should be created', inject([TestTypeService], (service: TestTypeService) => {
    expect(service).toBeTruthy();
  }));
});
