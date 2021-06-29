import { TestBed } from '@angular/core/testing';

import { GearParametersService } from './gear-parameters.service';

describe('GearParametersService', () => {
    let service: GearParametersService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GearParametersService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
