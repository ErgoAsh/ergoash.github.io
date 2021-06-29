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
        const dt = 0.1;

        let tNext = 0;
        let tPrevious = 0;

        while (true) {
            const t = tNext;
            const rho = this.mathService.polar(
                new Point(
                    baseRadius * (Math.cos(t) + t * Math.sin(t)),
                    baseRadius * (Math.sin(t) - t * Math.cos(t))
                )
            ).rho;

            if (rho > referenceRadius) {
                break;
            } else {
                tPrevious = tNext;
                tNext += dt;
            }
        }

        // Bisection method
        while (true) {
            const t = (tNext + tPrevious) / 2;
            const rho = this.mathService.polar(
                new Point(
                    baseRadius * (Math.cos(t) + t * Math.sin(t)),
                    baseRadius * (Math.sin(t) - t * Math.cos(t))
                )
            ).rho;

            const diff = referenceRadius - rho;
            if (Math.abs(diff) < Math.pow(10, -10)) {
                return t;
            } else if (diff < 0) {
                tNext = t;
            } else {
                tPrevious = t;
            }
        }
    }

    public generateAngleData(
        Teeth: number,
        InvoluteAngle: number,
        ToothSpacingAngle: number,
        TipAngle: number,
        StartAngleOffset: number
    ): Map<number, CurveType> {
        let GearAngleData = new Map<number, CurveType>();
        const InvoluteOffset = 0.0001; // TODO check

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

        const Tip = this.mathService.linspace(
            5,
            StartAngleOffset + InvoluteAngle,
            StartAngleOffset + InvoluteAngle + TipAngle
        );
        for (let j = 0; j < Teeth; j++) {
            for (const Item of Tip.map((n) => n + j * ToothSpacingAngle)) {
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

        const Dwell = this.mathService.linspace(
            5,
            StartAngleOffset + 2 * InvoluteAngle + TipAngle,
            StartAngleOffset + ToothSpacingAngle
        );
        for (let j = 0; j < Teeth; j++) {
            for (const Item of Dwell.map((n) => n + j * ToothSpacingAngle)) {
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
        const alpha = this.mathService.radians(20);

        const i = z2 / z1;

        const invAlphaPrime =
            (2 * Math.tan(alpha) * (x1 + x2)) / (z1 + z2) +
            this.mathService.involute(alpha);
        const alphaPrime = this.mathService.inverseInvolute(invAlphaPrime);

        const y =
            ((z1 + z2) / 2) * (Math.cos(alpha) / Math.cos(alphaPrime) - 1);
        const a = ((z1 + z2) / 2 + y) * m;

        // Pitch circle
        const d1 = z1 * m;
        const d2 = z2 * m;

        // Base circle
        const dB1 = d1 * Math.cos(alpha);
        const dB2 = d2 * Math.cos(alpha);

        // Working pitch diameter
        const d1Prime = dB1 / Math.cos(alphaPrime);
        const d2Prime = dB2 / Math.cos(alphaPrime);

        // Addendum
        const hA1 = (1 + y - x1) * m;
        const hA2 = (1 + y - x2) * m;
        // double h_a1 = (1 + x1) * m;
        // double h_a2 = (1 + x2) * m;

        // Addendum circle
        const dA1 = d1 + 2 * hA1;
        const dA2 = d2 + 2 * hA2;

        // Dedendum circle
        const h = (2.25 + y - (x1 + x2)) * m;
        // double h = 2.25 * m;
        const dF1 = dA1 - 2 * h;
        const dF2 = dA2 - 2 * h;

        // Overlap coefficient
        const epsilon =
            (Math.sqrt(Math.pow(dA1 / 2, 2) - Math.pow(dB1 / 2, 2)) +
                Math.sqrt(Math.pow(dA2 / 2, 2) - Math.pow(dB2 / 2, 2)) -
                a * Math.sin(alphaPrime)) /
            (Math.PI * m * Math.cos(alpha));

        // Pitch //TODO add to parameter list
        const p1 = (Math.PI * d1) / z1;
        const p2 = (Math.PI * d2) / z2;
        const p = Math.PI * m;
        // double spacing_1 = p / (d1 / 2);

        // Arc length of tooth at the reference pitch circle
        const sP1 = m * (Math.PI / 2 + 2 * x1 * Math.tan(alpha));
        const sP2 = m * (Math.PI / 2 + 2 * x2 * Math.tan(alpha));

        // Arc length of tooth at the working pitch circle
        const sW1 =
            d1Prime *
            (sP1 / d1 -
                this.mathService.involute(alphaPrime) +
                this.mathService.involute(alpha));
        const sW2 =
            d2Prime *
            (sP2 / d2 -
                this.mathService.involute(alphaPrime) +
                this.mathService.involute(alpha));

        // Arc length of tooth at the base pitch circle
        const sB1 =
            dB1 * (sW1 / d1Prime + this.mathService.involute(alphaPrime));
        const sB2 =
            dB2 * (sW2 / d2Prime + this.mathService.involute(alphaPrime));

        // InverseInvolute angle of whole involute curve
        const alphaA1 = Math.acos((d1 / dA1) * Math.cos(alpha));
        const alphaA2 = Math.acos((d2 / dA2) * Math.cos(alpha));

        // Arc length of tooth at the base pitch circle
        const sA1 = dA1 * (sB1 / dB1 - this.mathService.involute(alphaA1));
        const sA2 = dA2 * (sB2 / dB2 - this.mathService.involute(alphaA2));

        // TODO fix spacing between two meshing teeth and remove these after
        // const ang = (2 * sP1) / d1;
        // const angw = (2 * sW1) / d1Prime;
        // const angb = (2 * sB1) / dB1;
        // const anga = (2 * sA1) / dA1;

        // const test = Math.acos((d1 / d1) * Math.cos(alpha));
        // const testw = Math.acos((d1 / d1Prime) * Math.cos(alpha));
        // const testb = Math.acos((d1 / dB1) * Math.cos(alpha));
        // const testa = Math.acos((d1 / dA1) * Math.cos(alpha));

        const rho = 0.38 * m;

        const MechanismData = {
            Module: m,
            PressureAngle: 20,
            OperatingPressureAngle: this.mathService.degrees(alphaPrime),
            CenterDistance: a,
            CenterDistanceCoefficient: y,
            TransmissionRatio: i,
            ContactRatio: epsilon,
            Pitch: p,
            FilletRadius: rho,
        } as GearMechanismData;

        const Pinion = {
            NumberOfTeeth: z1,
            ShiftCoefficient: x1,
            ReferencePitchDiameter: d1,
            OperatingPitchDiameter: d1Prime,
            DedendumDiameter: dF1,
            AddendumDiameter: dA1,
            BaseCircleDiameter: dB1,
            ThicknessReference: sP1,
            ThicknessOperating: sW1,
            ThicknessBase: sB1,
            ThicknessTip: sA1,
            AngleTip: alphaA1,
        } as GearCharacteristicsData;

        const Gear = {
            NumberOfTeeth: z2,
            ShiftCoefficient: x2,
            ReferencePitchDiameter: d2,
            OperatingPitchDiameter: d2Prime,
            DedendumDiameter: dF2,
            AddendumDiameter: dA2,
            BaseCircleDiameter: dB2,
            ThicknessReference: sP2,
            ThicknessOperating: sW2,
            ThicknessBase: sB2,
            ThicknessTip: sA2,
            AngleTip: alphaA2,
        } as GearCharacteristicsData;

        const Result = {
            GearData: Gear,
            PinionData: Pinion,
            MechanismData,
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
