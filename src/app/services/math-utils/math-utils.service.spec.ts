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
        const inv = service.involute(service.radians(20));

        expect(inv).toBeGreaterThanOrEqual(0.014904);
        expect(inv).toBeLessThanOrEqual(0.014905);
    });

    it('#inverseInvolute should return a proper value', () => {
        const radians = service.inverseInvolute(0.014904383867336446);

        const angle = service.degrees(radians);

        expect(angle).toBeGreaterThanOrEqual(19.9999);
        expect(angle).toBeLessThanOrEqual(20.0001);
    });

    it('#translatePoint return a new point in proper position', () => {
        const startPoint = new Point(0, 0);
        const newPoint = service.translatePoint(startPoint, 1, 1);
        expect(newPoint.x).toEqual(1);
        expect(newPoint.y).toEqual(1);
    });

    it('#rotatePointAroundOther return a new point in proper position', () => {
        const originPoint = new Point(1, 0);
        const rotatedPoint = new Point(2, 0);
        const angle = service.radians(90);

        const newPoint = service.rotatePointAroundOther(
            rotatedPoint,
            originPoint,
            angle
        );

        expect(newPoint.x).toEqual(1);
        expect(newPoint.y).toEqual(1);
    });

    it('#linspace should generate proper array of numbers', () => {
        const array = service.linspace(4, 1, 2.5);
        expect(array).toEqual([1, 1.5, 2, 2.5]);
    });
});
