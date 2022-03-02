import { TestBed } from '@angular/core/testing';

import { GearVisualizationService } from './gear-visualization.service';

describe('AnimationServiceService', () => {
    let service: GearVisualizationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GearVisualizationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
