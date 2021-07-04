import { Injectable } from '@angular/core';
import { Point } from 'src/app/models/math-utils.model';
import {
    CurveType,
    CalculationsResultsData,
    GearGeometry,
} from '../../models/gear-parameters.model';
import { GearParametersService } from '../gear-parameters/gear-parameters.service';
import { MathUtilsService } from '../math-utils/math-utils.service';

import * as d3 from 'd3';

@Injectable({
    providedIn: 'root',
})
export class GearGeometryService {
    constructor(
        private mathService: MathUtilsService,
        private gearParametersService: GearParametersService
    ) {}

    public translateInvolute(
        involuteProfile: Point[],
        xOffset: number,
        yOffset: number
    ): Point[] {
        const newProfile: Point[] = [];
        involuteProfile.forEach((value) => {
            newProfile.push(
                this.mathService.translatePoint(value, xOffset, yOffset)
            );
        });
        return newProfile;
    }

    public rotateInvolute(
        involuteProfile: Point[],
        origin: Point,
        angle: number
    ): Point[] {
        const newProfile: Point[] = [];
        involuteProfile.forEach((value) => {
            newProfile.push(
                this.mathService.rotatePointAroundOther(value, origin, angle)
            );
        });
        return newProfile;
    }

    public generateGearCirclesGeometry(
        center: Point,
        dedendumDiameter: number,
        baseDiameter: number,
        referencePitchDiameter: number,
        workingPitchDiameter: number,
        addendumDiameter: number
    ): GearGeometry[] {
        const dedendumGeometry = d3.path();
        dedendumGeometry.arc(
            center.x,
            center.y,
            dedendumDiameter / 2,
            0,
            2 * Math.PI
        );

        const baseGeometry = d3.path();
        baseGeometry.arc(center.x, center.y, baseDiameter / 2, 0, 2 * Math.PI);

        const refPitchGeometry = d3.path();
        refPitchGeometry.arc(
            center.x,
            center.y,
            referencePitchDiameter / 2,
            0,
            2 * Math.PI
        );

        const workPitchGeometry = d3.path();
        workPitchGeometry.arc(
            center.x,
            center.y,
            workingPitchDiameter / 2,
            0,
            2 * Math.PI
        );

        const addendumGeometry = d3.path();
        addendumGeometry.arc(
            center.x,
            center.y,
            addendumDiameter / 2,
            0,
            2 * Math.PI
        );

        return [
            {
                path: dedendumGeometry,
                attributes: [
                    { key: 'stroke', value: 'black' },
                    { key: 'stroke-width', value: '0.75' },
                ],
            } as GearGeometry,
            {
                path: baseGeometry,
                attributes: [
                    { key: 'stroke', value: 'black' },
                    { key: 'stroke-width', value: '0.75' },
                    { key: 'stroke-dasharray', value: '1 1' },
                ],
            } as GearGeometry,
            {
                path: refPitchGeometry,
                attributes: [
                    { key: 'stroke', value: 'black' },
                    { key: 'stroke-width', value: '0.75' },
                    { key: 'stroke-dasharray', value: '3 1 1 1' },
                ],
            } as GearGeometry,
            {
                path: workPitchGeometry,
                attributes: [
                    { key: 'stroke', value: 'black' },
                    { key: 'stroke-width', value: '1' },
                ],
            } as GearGeometry,
            {
                path: addendumGeometry,
                attributes: [
                    { key: 'stroke', value: 'black' },
                    { key: 'stroke-width', value: '0.75' },
                ],
            } as GearGeometry,
        ];
    }

    public generateInvoluteProfile(
        baseRadius: number,
        dedendumRadius: number,
        addendumRadius: number,
        isDirectionInverted: boolean
    ): Point[] {
        const dir = isDirectionInverted ? -1 : 1;
        const tMax = this.gearParametersService.findTParameter(
            baseRadius,
            addendumRadius
        );
        let tMin = 0;

        if (baseRadius < dedendumRadius)
            tMin = this.gearParametersService.findTParameter(
                baseRadius,
                dedendumRadius
            );

        const list = new Array<Point>();
        const tArray = this.mathService.linspace(10, tMin, tMax);
        for (const t of tArray) {
            list.push(
                new Point(
                    baseRadius * (Math.cos(t) + t * Math.sin(t)),
                    baseRadius * (Math.sin(t) - t * Math.cos(t)) * dir
                )
            );
        }

        return list;
    }

    public generateGearProfile(
        BaseRadius: number,
        DedendumRadius: number,
        AddendumRadius: number,
        AngleCollection: Map<number, CurveType>,
        Center: Point
    ): d3.Path {
        const pointCollection = new Map<number, Point>();
        const collection = AngleCollection.entries();
        let [previousTheta, previousType] = collection.next().value;

        const risingInvoluteProfile = this.generateInvoluteProfile(
            BaseRadius,
            DedendumRadius,
            AddendumRadius,
            false
        );

        const returningInvoluteProfile = this.generateInvoluteProfile(
            BaseRadius,
            DedendumRadius,
            AddendumRadius,
            true
        );

        for (const [theta, type] of collection) {
            let point = new Point(0, 0);
            switch (type) {
                case CurveType.Dedendum:
                    point = this.mathService.translatePoint(
                        this.mathService.cartesian(DedendumRadius, theta),
                        Center.x,
                        Center.y
                    );
                    pointCollection.set(theta, point);
                    break;

                case CurveType.RisingInvolute:
                    if (previousType !== CurveType.RisingInvolute) break;

                    const risingInvolute = this.rotateInvolute(
                        this.translateInvolute(
                            risingInvoluteProfile,
                            Center.x,
                            Center.y
                        ),
                        Center,
                        previousTheta
                    );

                    const risingTh = this.mathService.linspace(
                        10,
                        previousTheta,
                        theta
                    );
                    for (const [i, invPoint] of risingInvolute.entries()) {
                        pointCollection.set(risingTh[i], invPoint);
                    }
                    break;

                case CurveType.ReturningInvolute:
                    if (previousType !== CurveType.ReturningInvolute) break;

                    const returningInvolute = this.rotateInvolute(
                        this.translateInvolute(
                            returningInvoluteProfile,
                            Center.x,
                            Center.y
                        ),
                        Center,
                        theta
                    );

                    const returningTh = this.mathService.linspace(
                        10,
                        previousTheta,
                        theta
                    );
                    for (const [i, invPoint] of Array<Point>()
                        .concat(returningInvolute)
                        .reverse()
                        .entries()) {
                        pointCollection.set(returningTh[i], invPoint);
                    }
                    break;

                case CurveType.Addendum:
                    // InvoluteMaxAngle = theta - previousTheta;

                    point = this.mathService.translatePoint(
                        this.mathService.cartesian(AddendumRadius, theta),
                        Center.x,
                        Center.y
                    );

                    pointCollection.set(theta, point);
                    break;
            }
            previousTheta = theta;
            previousType = type;
        }

        const Result = d3.path();
        const firstPoint = pointCollection.values().next().value as Point;
        Result.moveTo(firstPoint.x, firstPoint.y);

        pointCollection.forEach((value, key, map) => {
            Result.lineTo(value.x, value.y);
        });
        Result.lineTo(firstPoint.x, firstPoint.y);
        return Result;
    }

    public generateGearMechanismPath(
        data: CalculationsResultsData
    ): CalculationsResultsData {
        const pinion = data.PinionData;
        const gear = data.GearData;

        if (
            pinion === undefined ||
            gear === undefined ||
            data.MechanismData === undefined
        ) {
            throw new Error(
                '[generateGearMechanismPath] Mechanism data is undefined'
            );
        }

        const GearElements: GearGeometry[] = [
            ...this.generateGearCirclesGeometry(
                new Point(0, 0),
                pinion.DiameterDedendum,
                pinion.DiameterBase,
                pinion.DiameterReference,
                pinion.DiameterWorking,
                pinion.DiameterAddendum
            ),
            ...this.generateGearCirclesGeometry(
                new Point(data.MechanismData.CenterDistance, 0),
                gear.DiameterDedendum,
                gear.DiameterBase,
                gear.DiameterReference,
                gear.DiameterWorking,
                gear.DiameterAddendum
            ),
        ];

        const offsetPinion = -this.mathService.involute(
            pinion.PressureAngleWorking
        );

        const pinionAngles = this.gearParametersService.generateAngleData(
            pinion.NumberOfTeeth,
            this.mathService.involute(pinion.PressureAngleTip),
            pinion.TeethSpacing,
            pinion.WidthAngleTip,
            offsetPinion,
            5, // TODO add to form
            pinion.DiameterBase < pinion.DiameterDedendum
        );
        GearElements.push({
            path: this.generateGearProfile(
                pinion.DiameterBase / 2,
                pinion.DiameterDedendum / 2,
                pinion.DiameterAddendum / 2,
                pinionAngles,
                new Point(0, 0)
            ),
            attributes: [
                { key: 'stroke', value: 'orange' },
                { key: 'stroke-width', value: '1' },
                { key: 'stroke-linecap', value: 'round' },
                { key: 'stroke-linejoin', value: 'round' },
            ],
            name: 'pinion',
        });

        const offsetGear =
            (1 / 2) * Math.PI -
            this.mathService.involute(gear.PressureAngleWorking);

        const gearAngles = this.gearParametersService.generateAngleData(
            gear.NumberOfTeeth,
            this.mathService.involute(gear.PressureAngleTip),
            gear.TeethSpacing,
            gear.WidthAngleTip,
            offsetGear,
            5, // TODO add to form
            gear.DiameterBase < gear.DiameterDedendum
        );
        GearElements.push({
            path: this.generateGearProfile(
                gear.DiameterBase / 2,
                gear.DiameterDedendum / 2,
                gear.DiameterAddendum / 2,
                gearAngles,
                new Point(data.MechanismData.CenterDistance, 0)
            ),
            attributes: [
                { key: 'stroke', value: 'red' },
                { key: 'stroke-width', value: '1' },
                { key: 'stroke-linecap', value: 'round' },
                { key: 'stroke-linejoin', value: 'round' },
            ],
            name: 'gear',
        });

        const Result = {
            ...data,
            MechanismGeometry: GearElements,
        } as CalculationsResultsData;

        return Result;
    }
}
