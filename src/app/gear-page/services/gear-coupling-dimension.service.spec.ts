import { TestBed } from '@angular/core/testing';

import { GearCouplingDimensionService } from './gear-coupling-dimension.service';

describe('GearCouplingDimensionService', () => {
  let service: GearCouplingDimensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GearCouplingDimensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
