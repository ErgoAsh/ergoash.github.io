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
        teethNumber: number,
        involuteAngle: number,
        toothSpacingAngle: number,
        tipAngle: number,
        startOffsetAngle: number,
        arcPointNumber: number,
        isBaseBelowDedendum: boolean
    ): Map<number, CurveType> {
        let GearAngleData = new Map<number, CurveType>();

        for (let j = 0; j < teethNumber; j++) {
            const spacing = startOffsetAngle + j * toothSpacingAngle;

            GearAngleData.set(spacing, CurveType.RisingInvolute);
            GearAngleData.set(
                spacing + involuteAngle,
                CurveType.RisingInvolute
            );
        }

        const Tip = this.mathService.linspace(
            arcPointNumber,
            startOffsetAngle + involuteAngle,
            startOffsetAngle + involuteAngle + tipAngle
        );
        for (let j = 0; j < teethNumber; j++) {
            for (const Item of Tip.slice(1, arcPointNumber - 1).map(
                (n) => n + j * toothSpacingAngle
            )) {
                GearAngleData.set(Item, CurveType.Addendum);
            }
        }

        for (let j = 0; j < teethNumber; j++) {
            const spacing = startOffsetAngle + j * toothSpacingAngle;
            GearAngleData.set(
                spacing + involuteAngle + tipAngle,
                CurveType.ReturningInvolute
            );

            GearAngleData.set(
                spacing + 2 * involuteAngle + tipAngle,
                CurveType.ReturningInvolute
            );
        }

        const Dwell = this.mathService.linspace(
            arcPointNumber,
            startOffsetAngle + 2 * involuteAngle + tipAngle + 0.0000001,
            startOffsetAngle + toothSpacingAngle - 0.000001 // TODO fix? IDK what's going on
        );
        for (let j = 0; j < teethNumber; j++) {
            const dwellCorrected = isBaseBelowDedendum ? Dwell : Dwell; // TODO fix this line

            for (const Item of dwellCorrected.map(
                (n) => n + j * toothSpacingAngle
            )) {
                GearAngleData.set(Item, CurveType.Dedendum);
            }
        }

        GearAngleData = new Map([...GearAngleData.entries()].sort());

        return GearAngleData;
    }

    public pressureAngle(givenDiameter: number, baseDiameter: number): number {
        return Math.acos(baseDiameter / givenDiameter);
    }

    public teethWidth(
        givenDiameter: number,
        givenPressureInv: number,
        pitchDiameter: number,
        pitchTeethWidth: number,
        pressureInv: number
    ): number {
        return (
            givenDiameter *
            (pitchTeethWidth / pitchDiameter + pressureInv - givenPressureInv)
        );
    }

    public teethAngle(diameter: number, teethWidth: number): number {
        return 2 * (teethWidth / diameter);
    }

    public calculateCouplingParameters(
        m: number,
        z1: number,
        z2: number,
        x1: number,
        x2: number,
        cStar: number = 0.25
    ): CalculationsResultsData {
        const alpha = this.mathService.radians(20);
        const alphaInv = this.mathService.involute(alpha);

        const i = z2 / z1;

        const invAlphaPrime =
            (2 * Math.tan(alpha) * (x1 + x2)) / (z1 + z2) +
            this.mathService.involute(alpha);
        const alphaPrime = this.mathService.inverseInvolute(invAlphaPrime);

        const y =
            ((z1 + z2) / 2) * (Math.cos(alpha) / Math.cos(alphaPrime) - 1);
        const a = ((z1 + z2) / 2 + y) * m;

        const zg = (2 * y) / Math.pow(Math.sin(alpha), 2);

        // Pitch circle
        const d1 = z1 * m;
        const d2 = z2 * m;

        // Base circle
        const dB1 = d1 * Math.cos(alpha);
        const dB2 = d2 * Math.cos(alpha);

        // Working pitch diameter
        const d1Prime = dB1 / Math.cos(alphaPrime);
        const d2Prime = dB2 / Math.cos(alphaPrime);

        // Teeth height (using KHK formulae)
        const hA1 = (1 + y - x2) * m;
        const hA2 = (1 + y - x1) * m;

        const hF1 = (1 - x1 + cStar) * m;
        const hF2 = (1 - x2 + cStar) * m;

        const h1 = hA1 + hF1;
        const h2 = hA2 + hF2;

        // Addendum and dedendum diameters
        const dA1 = m * z1 + 2 * hA1;
        const dA2 = m * z2 + 2 * hA2;

        const dF1 = m * z1 - 2 * hF1;
        const dF2 = m * z2 - 2 * hF2;

        // Overlap coefficient
        const epsilon =
            (Math.sqrt(Math.pow(dA1 / 2, 2) - Math.pow(dB1 / 2, 2)) +
                Math.sqrt(Math.pow(dA2 / 2, 2) - Math.pow(dB2 / 2, 2)) -
                a * Math.sin(alphaPrime)) /
            (Math.PI * m * Math.cos(alpha));

        // Circular pitch
        const p = Math.PI * m;
        const spacing1 = (2 * Math.PI) / z1;
        const spacing2 = (2 * Math.PI) / z2;

        // Pressure angle at every circle (except for dedendum circle)
        const alphaW1 = this.pressureAngle(d1Prime, dB1);
        const alphaW2 = this.pressureAngle(d2Prime, dB2);

        const alphaB1 = this.pressureAngle(dB1, dB1);
        const alphaB2 = this.pressureAngle(dB2, dB2);

        const alphaA1 = this.pressureAngle(dA1, dB1);
        const alphaA2 = this.pressureAngle(dA2, dB2);

        const alphaP1 = this.pressureAngle(d1, dB1);
        const alphaP2 = this.pressureAngle(d2, dB2);

        // Arc length of teeth at every circle (except for dedendum circle)
        const sP1 = m * (Math.PI / 2 + 2 * x1 * Math.tan(alpha));
        const sP2 = m * (Math.PI / 2 + 2 * x2 * Math.tan(alpha));

        const sW1 = this.teethWidth(
            d1Prime,
            this.mathService.involute(alphaW1),
            d1,
            sP1,
            alphaInv
        );

        const sW2 = this.teethWidth(
            d2Prime,
            this.mathService.involute(alphaW2),
            d2,
            sP2,
            alphaInv
        );

        const sB1 = this.teethWidth(
            dB1,
            this.mathService.involute(alphaB1),
            d1,
            sP1,
            alphaInv
        );

        const sB2 = this.teethWidth(
            dB2,
            this.mathService.involute(alphaB2),
            d2,
            sP2,
            alphaInv
        );

        const sA1 = this.teethWidth(
            dA1,
            this.mathService.involute(alphaA1),
            d1,
            sP1,
            alphaInv
        );

        const sA2 = this.teethWidth(
            dA2,
            this.mathService.involute(alphaA2),
            d2,
            sP2,
            alphaInv
        );

        // Angle of teeth at every circle (except for dedendum circle)
        const thetaW1 = this.teethAngle(d1Prime, sW1);
        const thetaW2 = this.teethAngle(d2Prime, sW2);

        const thetaB1 = this.teethAngle(dB1, sB1);
        const thetaB2 = this.teethAngle(dB2, sB2);

        const thetaA1 = this.teethAngle(dA1, sA1);
        const thetaA2 = this.teethAngle(dA2, sA2);

        const thetaP1 = this.teethAngle(d1, sP1);
        const thetaP2 = this.teethAngle(d2, sP2);

        const rho = 0.38 * m;

        const MechanismData = {
            Module: m,
            PressureAngle: 20,
            OperatingPressureAngle: this.mathService.degrees(alphaPrime),
            CenterDistance: a,
            CenterDistanceCoefficient: y,
            TransmissionRatio: i,
            ContactRatio: epsilon,
            MinimumTeethAmount: zg,
            CircularPitch: p,
            FilletRadius: rho,
        } as GearMechanismData;

        const Pinion = {
            NumberOfTeeth: z1,
            ShiftCoefficient: x1,
            TeethSpacing: spacing1,
            DiameterAddendum: dA1,
            DiameterWorking: d1Prime,
            DiameterReference: d1,
            DiameterBase: dB1,
            DiameterDedendum: dF1,
            ThicknessTip: sA1,
            ThicknessWorking: sW1,
            ThicknessReference: sP1,
            ThicknessBase: sB1,
            PressureAngleTip: alphaA1,
            PressureAngleWorking: alphaW1,
            PressureAngleReference: alphaP1,
            PressureAngleBase: alphaB1,
            WidthAngleTip: thetaA1,
            WidthAngleWorking: thetaW1,
            WidthAngleReference: thetaP1,
            WidthAngleBase: thetaB1,
        } as GearCharacteristicsData;

        const Gear = {
            NumberOfTeeth: z2,
            ShiftCoefficient: x2,
            TeethSpacing: spacing2,
            DiameterAddendum: dA2,
            DiameterWorking: d2Prime,
            DiameterReference: d2,
            DiameterBase: dB2,
            DiameterDedendum: dF2,
            ThicknessTip: sA2,
            ThicknessWorking: sW2,
            ThicknessReference: sP2,
            ThicknessBase: sB2,
            PressureAngleTip: alphaA2,
            PressureAngleWorking: alphaW2,
            PressureAngleReference: alphaP2,
            PressureAngleBase: alphaB2,
            WidthAngleTip: thetaA2,
            WidthAngleWorking: thetaW2,
            WidthAngleReference: thetaP2,
            WidthAngleBase: thetaB2,
        } as GearCharacteristicsData;

        const Result = {
            GearData: Gear,
            PinionData: Pinion,
            MechanismData,
            MechanismGeometry: undefined,
            ActionPosition: new Point(Pinion.DiameterWorking / 2, 0),
            GearPosition: new Point(
                Pinion.DiameterWorking / 2 + Gear.DiameterWorking / 2,
                0
            ),
            PinionPosition: new Point(0, 0),
        } as CalculationsResultsData;

        return Result;
    }
}
