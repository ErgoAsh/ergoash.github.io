import { TestBed } from '@angular/core/testing';

import { GearGeometryService } from './gear-geometry.service';

describe('GearCouplingDimensionService', () => {
    let service: GearGeometryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GearGeometryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
