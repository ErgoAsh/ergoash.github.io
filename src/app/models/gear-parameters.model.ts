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
    PinionData: GearCharacteristicsData;
    GearData: GearCharacteristicsData;
    MechanismData: GearMechanismData;
    MechanismGeometry?: GearGeometry[];
    PinionPosition: Point;
    GearPosition: Point;
    ActionPosition: Point;
}

export interface GearCharacteristicsData {
    NumberOfTeeth: number;
    ShiftCoefficient: number;
    ReferencePitchDiameter: number;
    OperatingPitchDiameter: number;
    DedendumDiameter: number;
    AddendumDiameter: number;
    BaseCircleDiameter: number;
    ThicknessReference: number;
    ThicknessOperating: number;
    ThicknessBase: number;
    ThicknessTip: number;
    AngleTip: number;
}

export interface GearMechanismData {
    Module: number;
    PressureAngle: number;
    OperatingPressureAngle: number;
    CenterDistance: number;
    CenterDistanceCoefficient: number;
    TransmissionRatio: number;
    ContactRatio: number;
    Pitch: number;
    FilletRadius: number;
}
