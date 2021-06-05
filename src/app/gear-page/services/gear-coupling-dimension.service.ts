import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {
    Point,
    PolarPoint,
    CurveType,
    GearCharacteristicsData,
    GearMechanismData,
    CalculationsResultsData,
    GearGeometry,
} from './gear-coupling-dimension.model';

@Injectable({
    providedIn: 'root',
})
export class GearCouplingCalculationService {
    private _defaultFigure:
        | d3.Selection<SVGGElement, unknown, HTMLElement, any>
        | undefined;

    get defaultFigure() {
        return this._defaultFigure;
    }

    set defaultFigure(value) {
        this._defaultFigure = value;
    }

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

    public findTParameter(baseRadius: number, referenceRadius: number): number {
        let dt = 0.1;

        let t_next = 0;
        let t_previous = 0;

        while (true) {
            let t = t_next;
            var rho = this.polar(
                new Point(
                    baseRadius * (Math.cos(t) + t * Math.sin(t)),
                    baseRadius * (Math.sin(t) - t * Math.cos(t))
                )
            ).rho;

            if (rho > referenceRadius) {
                break;
            } else {
                t_previous = t_next;
                t_next += dt;
            }
        }

        //Bisection method
        while (true) {
            let t = (t_next + t_previous) / 2;
            var rho = this.polar(
                new Point(
                    baseRadius * (Math.cos(t) + t * Math.sin(t)),
                    baseRadius * (Math.sin(t) - t * Math.cos(t))
                )
            ).rho;

            let diff = referenceRadius - rho;
            if (Math.abs(diff) < Math.pow(10, -10)) {
                return t;
            } else if (diff < 0) {
                t_next = t;
            } else {
                t_previous = t;
            }
        }
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

    public translateInvolute(
        involuteProfile: Point[],
        xOffset: number,
        yOffset: number
    ) {
        let newProfile: Point[] = [];
        involuteProfile.forEach((value) => {
            newProfile.push(this.translatePoint(value, xOffset, yOffset));
        });
        return newProfile;
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

    public rotateInvolute(
        involuteProfile: Point[],
        origin: Point,
        angle: number
    ): Point[] {
        let newProfile: Point[] = [];
        involuteProfile.forEach((value) => {
            newProfile.push(this.rotatePointAroundOther(value, origin, angle));
        });
        return newProfile;
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
            { path: dedendumGeometry, attributes: undefined } as GearGeometry,
            { path: baseGeometry, attributes: undefined } as GearGeometry,
            { path: refPitchGeometry, attributes: undefined } as GearGeometry,
            { path: workPitchGeometry, attributes: undefined } as GearGeometry,
            { path: addendumGeometry, attributes: undefined } as GearGeometry,
        ];
    }

    public generateAngleData(
        dTheta: number,
        Teeth: number,
        InvoluteAngle: number,
        ToothSpacingAngle: number,
        TipAngle: number,
        StartAngleOffset: number
    ): Map<number, CurveType> {
        var GearAngleData = new Map<number, CurveType>();
        var InvoluteOffset = 0.0001;

        for (let j = 0; j < Teeth; j++) {
            GearAngleData.set(
                StartAngleOffset + j * ToothSpacingAngle + InvoluteOffset,
                CurveType.RisingInvolute
            );

            GearAngleData.set(
                InvoluteAngle +
                    StartAngleOffset +
                    j * ToothSpacingAngle -
                    InvoluteOffset,
                CurveType.RisingInvolute
            );
        }

        var Tip = this.linspace(
            5,
            StartAngleOffset + InvoluteAngle,
            StartAngleOffset + InvoluteAngle + TipAngle
        );
        for (let j = 0; j < Teeth; j++) {
            for (let Item of Tip.map((n) => n + j * ToothSpacingAngle)) {
                GearAngleData.set(Item, CurveType.Addendum);
            }
        }

        for (let j = 0; j < Teeth; j++) {
            GearAngleData.set(
                StartAngleOffset +
                    InvoluteAngle +
                    TipAngle +
                    j * ToothSpacingAngle +
                    InvoluteOffset,
                CurveType.ReturningInvolute
            );

            GearAngleData.set(
                StartAngleOffset +
                    2 * InvoluteAngle +
                    TipAngle +
                    j * ToothSpacingAngle -
                    InvoluteOffset,
                CurveType.ReturningInvolute
            );
        }

        var Dwell = this.linspace(
            5,
            StartAngleOffset + 2 * InvoluteAngle + TipAngle,
            StartAngleOffset + ToothSpacingAngle
        );
        for (let j = 0; j < Teeth; j++) {
            for (var Item of Dwell.map((n) => n + j * ToothSpacingAngle)) {
                GearAngleData.set(Item, CurveType.Dedendum);
            }
        }

        GearAngleData = new Map([...GearAngleData.entries()].sort());

        return GearAngleData;
    }

    public generateInvoluteProfile(
        baseRadius: number,
        dedendumRadius: number,
        addendumRadius: number,
        isDirectionInverted: boolean
    ): Point[] {
        var dir = isDirectionInverted ? -1 : 1;
        let t_max = this.findTParameter(baseRadius, addendumRadius);
        let t_min = 0;

        if (baseRadius < dedendumRadius)
            t_min = this.findTParameter(baseRadius, dedendumRadius);

        let list = new Array<Point>();
        let t_array = this.linspace(10, t_min, t_max);
        for (let t of t_array) {
            list.push(
                new Point(
                    baseRadius * (Math.cos(t) + t * Math.sin(t)),
                    dir * baseRadius * (Math.sin(t) - t * Math.cos(t))
                )
            );
        }

        //TODO remove
        let path = d3.path();
        path.moveTo(0, 0);
        for (let item of list) {
            path.lineTo(item.x, item.y);
        }
        this.showElement(path).attr('stroke', 'red');
        //TODO remove

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
                    point = this.translatePoint(
                        this.cartesian(DedendumRadius, theta),
                        Center.x,
                        Center.y
                    );
                    pointCollection.set(theta, point);
                    break;

                case CurveType.RisingInvolute:
                    if (previousType != CurveType.RisingInvolute) continue;

                    let risingInvolute = this.rotateInvolute(
                        this.translateInvolute(
                            risingInvoluteProfile,
                            Center.x,
                            Center.y
                        ),
                        Center,
                        previousTheta
                    );

                    let risingTh = this.linspace(10, previousTheta, theta);
                    for (let [i, point] of risingInvolute.entries()) {
                        pointCollection.set(risingTh[i], point);
                    }
                    break;

                case CurveType.ReturningInvolute:
                    if (previousType != CurveType.ReturningInvolute) continue;

                    let returningInvolute = this.rotateInvolute(
                        this.translateInvolute(
                            returningInvoluteProfile,
                            Center.x,
                            Center.y
                        ),
                        Center,
                        previousTheta
                    );

                    let returningTh = this.linspace(10, previousTheta, theta);
                    for (let [i, point] of Array<Point>()
                        .concat(returningInvolute)
                        .reverse()
                        .entries()) {
                        pointCollection.set(returningTh[i], point);
                    }
                    break;

                case CurveType.Addendum:
                    //InvoluteMaxAngle = theta - previousTheta;

                    point = this.translatePoint(
                        this.cartesian(AddendumRadius, theta),
                        Center.x,
                        Center.y
                    );

                    pointCollection.set(theta, point);
                    break;
            }
            previousTheta = theta;
        }
        // var aa = d3.line()(points.map((point) => {
        //     return [point.x, point.y]
        // }) as [number, number][]);

        var Result = d3.path();
        let firstPoint = <Point>pointCollection.values().next().value;
        Result.moveTo(firstPoint.x, firstPoint.y);

        //let newPointCollection = new Map<number, Point>();
        //let i = 0;
        // pointCollection.forEach((value, key, map) => {
        //     if (i <= 15) {
        //         newPointCollection.set(key, value);
        //         i++;
        //     }
        // });

        pointCollection.forEach((value, key, map) => {
            Result.lineTo(value.x, value.y);
        });
        return Result;
    }

    public calculateCouplingParameters(
        m: number,
        z1: number,
        z2: number,
        x1: number,
        x2: number
    ): CalculationsResultsData {
        var alpha = this.radians(20);

        var i = z2 / z1;

        var inv_alpha_prime =
            (2 * Math.tan(alpha) * (x1 + x2)) / (z1 + z2) +
            this.involute(alpha);
        var alpha_prime = this.inverseInvolute(inv_alpha_prime);

        var y = ((z1 + z2) / 2) * (Math.cos(alpha) / Math.cos(alpha_prime) - 1);
        var a = ((z1 + z2) / 2 + y) * m;

        // Pitch circle
        var d1 = z1 * m;
        var d2 = z2 * m;

        // Base circle
        var d_b1 = d1 * Math.cos(alpha);
        var d_b2 = d2 * Math.cos(alpha);

        // Working pitch diameter
        var d1_prime = d_b1 / Math.cos(alpha_prime);
        var d2_prime = d_b2 / Math.cos(alpha_prime);

        // Addendum
        var h_a1 = (1 + y - x1) * m;
        var h_a2 = (1 + y - x2) * m;
        //double h_a1 = (1 + x1) * m;
        //double h_a2 = (1 + x2) * m;

        // Addendum circle
        var d_a1 = d1 + 2 * h_a1;
        var d_a2 = d2 + 2 * h_a2;

        // Dedendum circle
        var h = (2.25 + y - (x1 + x2)) * m;
        //double h = 2.25 * m;
        var d_f1 = d_a1 - 2 * h;
        var d_f2 = d_a2 - 2 * h;

        // Overlap coefficient
        var epsilon =
            (Math.sqrt(Math.pow(d_a1 / 2, 2) - Math.pow(d_b1 / 2, 2)) +
                Math.sqrt(Math.pow(d_a2 / 2, 2) - Math.pow(d_b2 / 2, 2)) -
                a * Math.sin(alpha_prime)) /
            (Math.PI * m * Math.cos(alpha));

        //Pitch
        var p1 = (Math.PI * d1) / z1;
        var p2 = (Math.PI * d2) / z2;
        var p = Math.PI * m;
        //double spacing_1 = p / (d1 / 2);

        // Arc length of tooth at the reference pitch circle
        var s_1 = m * (Math.PI / 2 + 2 * x1 * Math.tan(alpha));
        var s_2 = m * (Math.PI / 2 + 2 * x2 * Math.tan(alpha));

        // Arc length of tooth at the working pitch circle
        var sw_1 =
            d1_prime *
            (s_1 / d1 - this.involute(alpha_prime) + this.involute(alpha));
        var sw_2 =
            d2_prime *
            (s_2 / d2 - this.involute(alpha_prime) + this.involute(alpha));

        // Arc length of tooth at the base pitch circle
        var sb_1 = d_b1 * (sw_1 / d1_prime + this.involute(alpha_prime));
        var sb_2 = d_b2 * (sw_2 / d2_prime + this.involute(alpha_prime));

        // InverseInvolute angle of whole involute curve
        var alpha_a1 = Math.acos((d1 / d_a1) * Math.cos(alpha));
        var alpha_a2 = Math.acos((d2 / d_a2) * Math.cos(alpha));

        // Arc length of tooth at the base pitch circle
        var sa_1 = d_a1 * (sb_1 / d_b1 - this.involute(alpha_a1));
        var sa_2 = d_a2 * (sb_2 / d_b2 - this.involute(alpha_a2));

        var ang = (2 * s_1) / d1;
        var angw = (2 * sw_1) / d1_prime;
        var angb = (2 * sb_1) / d_b1;
        var anga = (2 * sa_1) / d_a1;

        var test = Math.acos((d1 / d1) * Math.cos(alpha));
        var testw = Math.acos((d1 / d1_prime) * Math.cos(alpha));
        var testb = Math.acos((d1 / d_b1) * Math.cos(alpha));
        var testa = Math.acos((d1 / d_a1) * Math.cos(alpha));

        var rho = 0.38 * m;

        var MechanismData = {
            Module: m,
            PressureAngle: 20,
            OperatingPressureAngle: this.degrees(alpha_prime),
            CenterDistance: a,
            CenterDistanceCoefficient: y,
            TransmissionRatio: i,
            ContactRatio: epsilon,
            Pitch: p,
            FilletRadius: rho,
        } as GearMechanismData;

        var Pinion = {
            NumberOfTeeth: z1,
            ShiftCoefficient: x1,
            ReferencePitchDiameter: d1,
            OperatingPitchDiameter: d1_prime,
            DedendumDiameter: d_f1,
            AddendumDiameter: d_a1,
            BaseCircleDiameter: d_b1,
            ThicknessReference: s_1,
            ThicknessOperating: sw_1,
            ThicknessBase: sb_1,
            ThicknessTip: sa_1,
            AngleTip: alpha_a1,
        } as GearCharacteristicsData;

        var Gear = {
            NumberOfTeeth: z2,
            ShiftCoefficient: x2,
            ReferencePitchDiameter: d2,
            OperatingPitchDiameter: d2_prime,
            DedendumDiameter: d_f2,
            AddendumDiameter: d_a2,
            BaseCircleDiameter: d_b2,
            ThicknessReference: s_2,
            ThicknessOperating: sw_2,
            ThicknessBase: sb_2,
            ThicknessTip: sa_2,
            AngleTip: alpha_a2,
        } as GearCharacteristicsData;

        var Result = {
            GearData: Gear,
            PinionData: Pinion,
            MechanismData: MechanismData,
            MechanismGeometry: undefined,
            ActionPosition: new Point(Pinion.OperatingPitchDiameter / 2, 0),
            GearPosition: new Point(
                Pinion.OperatingPitchDiameter / 2 +
                    Gear.OperatingPitchDiameter / 2,
                0
            ),
            PinionPosition: new Point(0, 0),
        } as CalculationsResultsData;

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

        let pinionAngles = this.generateAngleData(
            dTheta,
            pinion.NumberOfTeeth,
            this.involute(pinion.AngleTip),
            (2 * Math.PI) / pinion.NumberOfTeeth,
            (2 * pinion.ThicknessTip) / pinion.AddendumDiameter,
            this.involute(
                this.radians(data.MechanismData.OperatingPressureAngle)
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
            attributes: undefined,
        });

        var Offset =
            (1 / 2) * Math.PI -
            (2 * gear.ThicknessBase) / gear.BaseCircleDiameter +
            this.involute(
                this.radians(data.MechanismData.OperatingPressureAngle)
            );
        var gearAngles = this.generateAngleData(
            dTheta,
            gear.NumberOfTeeth,
            this.involute(gear.AngleTip),
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
            attributes: undefined,
        });

        var Result = {
            ...data,
            MechanismGeometry: GearElements,
        } as CalculationsResultsData;

        return Result;
    }

    showElement(
        element: d3.Path,
        figure:
            | d3.Selection<SVGGElement, unknown, HTMLElement, any>
            | undefined = undefined,
        attributes: { key: string; value: string }[] | undefined = undefined
    ) {
        let result = null;

        if (figure == undefined) {
            if (this.defaultFigure == undefined)
                throw new Error('Default SVG figure has not been specified');

            result = this.defaultFigure
                .append('path')
                .attr('d', element.toString());
        } else {
            result = figure.append('path').attr('d', element.toString());
        }

        if (attributes == undefined) {
            result.attr('stroke', 'black').attr('fill', 'none');
        } else {
            for (let entry of attributes) {
                result = result.attr(entry.key, entry.value);
            }
        }

        return result;
    }

    constructor() {}
}
