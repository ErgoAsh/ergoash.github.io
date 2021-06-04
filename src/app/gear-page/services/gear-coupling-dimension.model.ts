export enum CurveType {
    Dedendum,
    RisingInvolute,
    ReturningInvolute,
    Addendum,
}

export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class PolarPoint {
    public rho: number;
    public theta: number;

    constructor(rho: number, theta: number) {
        this.rho = rho;
        this.theta = theta;
    }
}

export interface CalculationsResultsData {
    PinionData: GearCharacteristicsData;
    GearData: GearCharacteristicsData;
    MechanismData: GearMechanismData;
    MechanismGeometry: d3.Path[] | null;
    PinionPosition: Point;
    GearPosition: Point;
    ActionPosition: Point;
    //PinionPoints: Path2D
    //GearPoints: Path2D
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
