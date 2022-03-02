import { Point } from './math-utils.model';

export enum CurveType {
    Dedendum,
    RisingInvolute,
    ReturningInvolute,
    Addendum,
}

export interface GearGeometry {
    path: d3.Path;
    attributes?: {
        key: string;
        value: string;
    }[];
    name?: string;
}

export interface CalculationsResultsData {
    PinionData?: GearCharacteristicsData;
    GearData?: GearCharacteristicsData;
    MechanismData?: GearMechanismData;
    MechanismGeometry?: GearGeometry[];
    PinionPosition: Point;
    GearPosition: Point;
    ActionPosition: Point;
}

export interface GearCharacteristicsData {
    NumberOfTeeth: number;
    ShiftCoefficient: number;
    TeethSpacing: number;
    DiameterAddendum: number;
    DiameterWorking: number;
    DiameterReference: number;
    DiameterBase: number;
    DiameterDedendum: number;
    ThicknessTip: number;
    ThicknessWorking: number;
    ThicknessReference: number;
    ThicknessBase: number;
    PressureAngleTip: number;
    PressureAngleWorking: number;
    PressureAngleReference: number;
    PressureAngleBase: number;
    WidthAngleTip: number;
    WidthAngleWorking: number;
    WidthAngleReference: number;
    WidthAngleBase: number;
}

export interface GearMechanismData {
    Module: number;
    PressureAngle: number;
    OperatingPressureAngle: number;
    CenterDistance: number;
    CenterDistanceCoefficient: number;
    TransmissionRatio: number;
    ContactRatio: number;
    MinimumTeethAmount: number;
    CircularPitch: number;
    FilletRadius: number;
}
