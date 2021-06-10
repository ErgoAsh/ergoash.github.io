import { Injectable } from '@angular/core';
import {
    CalculationsResultsData,
    CurveType,
    GearCharacteristicsData,
    GearMechanismData,
} from 'src/app/models/gear-parameters.model';
import { Point } from 'src/app/models/math-utils.model';
import { MathUtilsService } from '../math-utils/math-utils.service';

@Injectable({
    providedIn: 'root',
})
export class GearParametersService {
    constructor(private mathService: MathUtilsService) {}

    /**
     * Finds a t-parameter of involute equations to match involute length between base and reference radius
     * @param baseRadius radius from which the involute is being calculated
     * @param referenceRadius radius where the involute ends
     * @returns parameter "t"
     */
    public findTParameter(baseRadius: number, referenceRadius: number): number {
        let dt = 0.1;

        let t_next = 0;
        let t_previous = 0;

        while (true) {
            let t = t_next;
            var rho = this.mathService.polar(
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
            var rho = this.mathService.polar(
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

    public generateAngleData(
        dTheta: number, //TODO remove
        Teeth: number,
        InvoluteAngle: number,
        ToothSpacingAngle: number,
        TipAngle: number,
        StartAngleOffset: number
    ): Map<number, CurveType> {
        var GearAngleData = new Map<number, CurveType>();
        var InvoluteOffset = 0.0001; //TODO check

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

        var Tip = this.mathService.linspace(
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

        var Dwell = this.mathService.linspace(
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

    public calculateCouplingParameters(
        m: number,
        z1: number,
        z2: number,
        x1: number,
        x2: number
    ): CalculationsResultsData {
        var alpha = this.mathService.radians(20);

        var i = z2 / z1;

        var inv_alpha_prime =
            (2 * Math.tan(alpha) * (x1 + x2)) / (z1 + z2) +
            this.mathService.involute(alpha);
        var alpha_prime = this.mathService.inverseInvolute(inv_alpha_prime);

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

        //Pitch //TODO add to parameter list
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
            (s_1 / d1 -
                this.mathService.involute(alpha_prime) +
                this.mathService.involute(alpha));
        var sw_2 =
            d2_prime *
            (s_2 / d2 -
                this.mathService.involute(alpha_prime) +
                this.mathService.involute(alpha));

        // Arc length of tooth at the base pitch circle
        var sb_1 =
            d_b1 * (sw_1 / d1_prime + this.mathService.involute(alpha_prime));
        var sb_2 =
            d_b2 * (sw_2 / d2_prime + this.mathService.involute(alpha_prime));

        // InverseInvolute angle of whole involute curve
        var alpha_a1 = Math.acos((d1 / d_a1) * Math.cos(alpha));
        var alpha_a2 = Math.acos((d2 / d_a2) * Math.cos(alpha));

        // Arc length of tooth at the base pitch circle
        var sa_1 = d_a1 * (sb_1 / d_b1 - this.mathService.involute(alpha_a1));
        var sa_2 = d_a2 * (sb_2 / d_b2 - this.mathService.involute(alpha_a2));

        //TODO fix spacing between two meshing teeth and remove these after
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
            OperatingPressureAngle: this.mathService.degrees(alpha_prime),
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
}
