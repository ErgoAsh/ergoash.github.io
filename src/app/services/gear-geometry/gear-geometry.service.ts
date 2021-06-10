import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Point } from 'src/app/models/math-utils.model';
import {
    CurveType,
    CalculationsResultsData,
    GearGeometry,
} from '../../models/gear-parameters.model';
import { GearParametersService } from '../gear-parameters/gear-parameters.service';
import { MathUtilsService } from '../math-utils/math-utils.service';

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
    ) {
        let newProfile: Point[] = [];
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
        let newProfile: Point[] = [];
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
        let dedendumGeometry = d3.path();
        dedendumGeometry.arc(
            center.x,
            center.y,
            dedendumDiameter / 2,
            0,
            2 * Math.PI
        );

        let baseGeometry = d3.path();
        baseGeometry.arc(center.x, center.y, baseDiameter / 2, 0, 2 * Math.PI);

        let refPitchGeometry = d3.path();
        refPitchGeometry.arc(
            center.x,
            center.y,
            referencePitchDiameter / 2,
            0,
            2 * Math.PI
        );

        let workPitchGeometry = d3.path();
        workPitchGeometry.arc(
            center.x,
            center.y,
            workingPitchDiameter / 2,
            0,
            2 * Math.PI
        );

        let addendumGeometry = d3.path();
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
                    { key: 'stroke-dasharray', value: '2 1' },
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
        var dir = isDirectionInverted ? -1 : 1;
        let t_max = this.gearParametersService.findTParameter(
            baseRadius,
            addendumRadius
        );
        let t_min = 0;

        if (baseRadius < dedendumRadius)
            t_min = this.gearParametersService.findTParameter(
                baseRadius,
                dedendumRadius
            );

        let list = new Array<Point>();
        let t_array = this.mathService.linspace(10, t_min, t_max);
        for (let t of t_array) {
            list.push(
                new Point(
                    baseRadius * (Math.cos(t) + t * Math.sin(t)),
                    dir * baseRadius * (Math.sin(t) - t * Math.cos(t))
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
        let pointCollection = new Map<number, Point>();
        let collection = AngleCollection.entries();
        let [previousTheta, previousType] = collection.next().value;

        let risingInvoluteProfile = this.generateInvoluteProfile(
            BaseRadius,
            DedendumRadius,
            AddendumRadius,
            false
        );

        let returningInvoluteProfile = this.generateInvoluteProfile(
            BaseRadius,
            DedendumRadius,
            AddendumRadius,
            true
        );

        for (let [theta, type] of collection) {
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
                    if (previousType != CurveType.RisingInvolute) break;

                    let risingInvolute = this.rotateInvolute(
                        this.translateInvolute(
                            risingInvoluteProfile,
                            Center.x,
                            Center.y
                        ),
                        Center,
                        previousTheta
                    );

                    let risingTh = this.mathService.linspace(
                        10,
                        previousTheta,
                        theta
                    );
                    for (let [i, point] of risingInvolute.entries()) {
                        pointCollection.set(risingTh[i], point);
                    }
                    break;

                case CurveType.ReturningInvolute:
                    if (previousType != CurveType.ReturningInvolute) break;

                    let returningInvolute = this.rotateInvolute(
                        this.translateInvolute(
                            returningInvoluteProfile,
                            Center.x,
                            Center.y
                        ),
                        Center,
                        theta
                    );

                    let returningTh = this.mathService.linspace(
                        10,
                        previousTheta,
                        theta
                    );
                    for (let [i, point] of Array<Point>()
                        .concat(returningInvolute)
                        .reverse()
                        .entries()) {
                        pointCollection.set(returningTh[i], point);
                    }
                    break;

                case CurveType.Addendum:
                    //InvoluteMaxAngle = theta - previousTheta;

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

        var Result = d3.path();
        let firstPoint = <Point>pointCollection.values().next().value;
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
        let dTheta = 0.1;

        let pinion = data.PinionData;
        let gear = data.GearData;

        let GearElements: GearGeometry[] = [
            ...this.generateGearCirclesGeometry(
                new Point(0, 0),
                pinion.DedendumDiameter,
                pinion.BaseCircleDiameter,
                pinion.ReferencePitchDiameter,
                pinion.OperatingPitchDiameter,
                pinion.AddendumDiameter
            ),
            ...this.generateGearCirclesGeometry(
                new Point(data.MechanismData.CenterDistance, 0),
                gear.DedendumDiameter,
                gear.BaseCircleDiameter,
                gear.ReferencePitchDiameter,
                gear.OperatingPitchDiameter,
                gear.AddendumDiameter
            ),
        ];

        let pinionAngles = this.gearParametersService.generateAngleData(
            dTheta,
            pinion.NumberOfTeeth,
            this.mathService.involute(pinion.AngleTip),
            (2 * Math.PI) / pinion.NumberOfTeeth,
            (2 * pinion.ThicknessTip) / pinion.AddendumDiameter,
            this.mathService.involute(
                this.mathService.radians(
                    data.MechanismData.OperatingPressureAngle
                )
            )
        );
        GearElements.push({
            path: this.generateGearProfile(
                pinion.BaseCircleDiameter / 2,
                pinion.DedendumDiameter / 2,
                pinion.AddendumDiameter / 2,
                pinionAngles,
                new Point(0, 0)
            ),
            attributes: [
                { key: 'stroke', value: 'orange' },
                { key: 'stroke-width', value: '1' },
            ],
            name: 'pinion',
        });

        var Offset =
            (1 / 2) * Math.PI -
            (2 * gear.ThicknessBase) / gear.BaseCircleDiameter +
            this.mathService.involute(
                this.mathService.radians(
                    data.MechanismData.OperatingPressureAngle
                )
            );
        var gearAngles = this.gearParametersService.generateAngleData(
            dTheta,
            gear.NumberOfTeeth,
            this.mathService.involute(gear.AngleTip),
            (2 * Math.PI) / gear.NumberOfTeeth,
            (2 * gear.ThicknessTip) / gear.AddendumDiameter,
            Offset
        );
        GearElements.push({
            path: this.generateGearProfile(
                gear.BaseCircleDiameter / 2,
                gear.DedendumDiameter / 2,
                gear.AddendumDiameter / 2,
                gearAngles,
                new Point(data.MechanismData.CenterDistance, 0)
            ),
            attributes: [
                { key: 'stroke', value: 'red' },
                { key: 'stroke-width', value: '1' },
            ],
            name: 'gear',
        });

        var Result = {
            ...data,
            MechanismGeometry: GearElements,
        } as CalculationsResultsData;

        return Result;
    }
}
