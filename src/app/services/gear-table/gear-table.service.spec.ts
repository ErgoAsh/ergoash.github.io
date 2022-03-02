import { TestBed } from '@angular/core/testing';

import { GearTableService } from './gear-table.service';

describe('GearTableService', () => {
    let service: GearTableService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GearTableService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
