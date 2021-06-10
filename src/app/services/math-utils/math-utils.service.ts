import { Injectable } from '@angular/core';
import { Point, PolarPoint } from 'src/app/models/math-utils.model';

@Injectable({
    providedIn: 'root',
})
export class MathUtilsService {
    constructor() {}

    public radians(angle: number): number {
        return (Math.PI / 180) * angle;
    }

    public degrees(radians: number): number {
        return (180 / Math.PI) * radians;
    }

    public involute(angleRad: number): number {
        return Math.tan(angleRad) - angleRad;
    }

    /**
     * Calculate angle of inverse involute
     * @param involute inverse involute value (in radians)
     * @returns angle in radians
     */
    public inverseInvolute(involute: number): number {
        let angle1 = 0;

        while (true) {
            let angle2 = angle1;
            angle1 = Math.atan(angle1 + involute);

            let Diff = Math.abs(angle1 - angle2);
            if (Diff < Math.pow(10, -10)) {
                break;
            }
        }

        return angle1;
    }

    public cartesian(Rho: number, Phi: number): Point {
        return new Point(Rho * Math.cos(Phi), Rho * Math.sin(Phi));
    }

    public polar(p: Point): PolarPoint {
        return new PolarPoint(
            Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2)),
            Math.atan(p.y / p.x)
        );
    }

    public translatePoint(p: Point, xOffset: number, yOffset: number): Point {
        return new Point(p.x + xOffset, p.y + yOffset);
    }

    /**
     * Rotates point around given point with specified angle
     * @param point point that will be rotated around origin
     * @param origin origin of the rotation
     * @param angle rotation of counter-clockwise rotation (in radians)
     * @returns rotated point
     */
    public rotatePointAroundOther(
        point: Point,
        origin: Point,
        angle: number
    ): Point {
        return new Point(
            Math.cos(angle) * (point.x - origin.x) -
                Math.sin(angle) * (point.y - origin.y) +
                origin.x,
            Math.sin(angle) * (point.x - origin.x) +
                Math.cos(angle) * (point.y - origin.y) +
                origin.y
        );
    }

    public linspace(length: number, start: number, stop: number) {
        if (typeof length === 'undefined')
            length = Math.max(Math.round(stop - start) + 1, 1);

        if (length < 2) {
            return length === 1 ? [start] : [];
        }

        let data = Array(length);
        length--;

        for (let i = length; i >= 0; i--) {
            data[i] = (i * stop + (length - i) * start) / length;
        }

        return data;
    }
}
