import { TestBed } from '@angular/core/testing';
import { Point } from 'src/app/models/math-utils.model';

import { MathUtilsService } from './math-utils.service';

describe('MathUtilsService', () => {
    let service: MathUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MathUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#involute should return a proper value', () => {
        let inv = service.involute(service.radians(20));

        expect(inv).toBeGreaterThanOrEqual(0.014904);
        expect(inv).toBeLessThanOrEqual(0.014905);
    });

    it('#inverseInvolute should return a proper value', () => {
        let radians = service.inverseInvolute(0.014904383867336446);

        let angle = service.degrees(radians);

        expect(angle).toBeGreaterThanOrEqual(19.9999);
        expect(angle).toBeLessThanOrEqual(20.0001);
    });

    it('#translatePoint return a new point in proper position', () => {
        let start_point = new Point(0, 0);
        let new_point = service.translatePoint(start_point, 1, 1);
        expect(new_point.x).toEqual(1);
        expect(new_point.y).toEqual(1);
    });

    it('#rotatePointAroundOther return a new point in proper position', () => {
        let origin_point = new Point(1, 0);
        let rotated_point = new Point(2, 0);
        let angle = service.radians(90);

        let new_point = service.rotatePointAroundOther(
            rotated_point,
            origin_point,
            angle
        );

        expect(new_point.x).toEqual(1);
        expect(new_point.y).toEqual(1);
    });

    it('#linspace should generate proper array of numbers', () => {
        let array = service.linspace(4, 1, 2.5);
        expect(array).toEqual([1, 1.5, 2, 2.5]);
    });
});
