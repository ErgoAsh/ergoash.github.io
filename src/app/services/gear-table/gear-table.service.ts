import { Injectable } from '@angular/core';
import { CalculationsResultsData } from 'src/app/models/gear-parameters.model';
import { TableDataRow } from 'src/app/models/gear-tables.model';

@Injectable({
    providedIn: 'root',
})
export class GearTableService {
    constructor() {}

    getTableData(data: CalculationsResultsData): TableDataRow[] {
        if (data === undefined) {
            throw new Error(
                '[getTableData] Required data has not been provided'
            );
        }

        const Result: TableDataRow[] = [
            {
                key: '1',
                name: 'Mechanism basic data',
                children: [
                    {
                        key: '1-1',
                        name: 'Module',
                        formula: 'm',
                        valueLeft: data.MechanismData?.Module,
                        useColumnSpan: true,
                    },
                    {
                        key: '1-2',
                        name: 'Number of teeth',
                        formula: 'z',
                        valueLeft: data.GearData?.NumberOfTeeth,
                        valueRight: data.PinionData?.NumberOfTeeth,
                        useColumnSpan: false,
                    },
                    {
                        key: '1-3',
                        name: 'Pressure angle',
                        formula: '\\alpha',
                        valueLeft: data.MechanismData?.PressureAngle,
                        useColumnSpan: true,
                    },
                    {
                        key: '1-4',
                        name: 'Operating pressure angle',
                        formula:
                            "\\alpha' = inverseInvolute \\left(2\\tan{\\alpha}\\frac{x_1+x_2}{z_1+z_2}+inv{\\alpha} \\right)",
                        valueLeft: data.MechanismData?.OperatingPressureAngle,
                        useColumnSpan: true,
                    },
                    {
                        key: '1-5',
                        name: 'Transmission ratio',
                        formula: 'i = \\frac{z_2}{z_1}',
                        valueLeft: data.MechanismData?.TransmissionRatio,
                        useColumnSpan: true,
                    },
                    {
                        key: '1-6',
                        name: 'Contact ratio',
                        formula:
                            '\\epsilon = \\frac{\\sqrt{(\\frac{d_{a1}}{2})^2 - (\\frac{d_{b1}}{2})^2} + \\sqrt{(\\frac{d_{a2}}{2})^2 - (\\frac{d_{b2}}{2})^2} + a \\sin{\\alpha}}{\\pi m \\cos{\\alpha}}',
                        valueLeft: data.MechanismData?.ContactRatio,
                        useColumnSpan: true,
                    },
                ],
            },
            {
                key: '2',
                name: 'Circle diameters',
                children: [
                    {
                        key: '2-1',
                        name: 'Reference pitch circle diameter',
                        formula: 'd = zm',
                        valueLeft: data.GearData?.ReferencePitchDiameter,
                        valueRight: data.PinionData?.ReferencePitchDiameter,
                        useColumnSpan: false,
                    },
                    {
                        key: '2-2',
                        name: 'Base circle diameter',
                        formula: 'd_b = d\\cos{\\alpha}',
                        valueLeft: data.GearData?.BaseCircleDiameter,
                        valueRight: data.PinionData?.BaseCircleDiameter,
                        useColumnSpan: false,
                    },
                    {
                        key: '2-3',
                        name: 'Operating pitch circle diameter',
                        formula: "d' = \\frac{d_b}{\\cos{\\alpha'}}",
                        valueLeft: data.GearData?.OperatingPitchDiameter,
                        valueRight: data.PinionData?.OperatingPitchDiameter,
                        useColumnSpan: false,
                    },
                    {
                        key: '2-4',
                        name: 'Addendum circle diameter',
                        formula: 'd_a = d + 2h_a',
                        valueLeft: data.GearData?.AddendumDiameter,
                        valueRight: data.PinionData?.AddendumDiameter,
                        useColumnSpan: false,
                    },
                    {
                        key: '2-5',
                        name: 'Dedendum circle diameter',
                        formula: 'd_f = d - 2h',
                        valueLeft: data.GearData?.DedendumDiameter,
                        valueRight: data.PinionData?.DedendumDiameter,
                        useColumnSpan: false,
                    },
                ],
            },
            {
                key: '3',
                name: 'Geometrical parameters',
                children: [
                    {
                        key: '3-1',
                        name: 'Profile shift coefficients',
                        formula: 'x',
                        valueLeft: data.GearData?.ShiftCoefficient,
                        valueRight: data.PinionData?.ShiftCoefficient,
                        useColumnSpan: false,
                    },
                    {
                        key: '3-2',
                        name: 'Center distance modification coefficient',
                        formula:
                            "y = \\frac{z_1+z_2}{2} \\left( \\frac{\\cos{\\alpha}}{\\cos{\\alpha'}}-1 \\right)",
                        valueLeft:
                            data.MechanismData?.CenterDistanceCoefficient,
                        useColumnSpan: true,
                    },
                    {
                        key: '3-3',
                        name: 'Center distance',
                        formula: 'a = \\left(\\frac{z_1+z_2}{2} + y \\right) m',
                        valueLeft: data.MechanismData?.CenterDistance,
                        useColumnSpan: true,
                    },
                    {
                        key: '3-4',
                        name: 'Pitch (arc length)',
                        formula: 'p = \\pi m',
                        valueLeft: data.MechanismData?.Pitch,
                        useColumnSpan: true,
                    },
                    {
                        key: '3-5',
                        name: 'Fillet radius',
                        formula: '\\rho = 0.38 m',
                        valueLeft: data.MechanismData?.FilletRadius,
                        useColumnSpan: true,
                    },
                ],
            },
            {
                key: '4',
                name: 'Teeth geometry',
                children: [
                    {
                        key: '4-1',
                        name: 'Tooth thickness at the reference pitch circle',
                        formula:
                            "s = m \\left(\\frac{1}{2} \\pi + 2x + \\tan{\\alpha'} \\right)",
                        valueLeft: data.GearData?.ThicknessReference,
                        valueRight: data.PinionData?.ThicknessReference,
                        useColumnSpan: false,
                    },
                    {
                        key: '4-2',
                        name: 'Tooth thickness at the operating pitch circle',
                        formula:
                            "s_w = d' \\left(\\frac{s}{d} + inv(\\alpha) - inv(\\alpha') \\right)",
                        valueLeft: data.GearData?.ThicknessOperating,
                        valueRight: data.PinionData?.ThicknessOperating,
                        useColumnSpan: false,
                    },
                    {
                        key: '4-3',
                        name: 'Tooth thickness at the base circle',
                        formula:
                            "s = d_b \\left(\\frac{s_w}{d_w} + inv(\\alpha') \\right)",
                        valueLeft: data.GearData?.ThicknessBase,
                        valueRight: data.PinionData?.ThicknessBase,
                        useColumnSpan: false,
                    },
                    {
                        key: '4-4',
                        name: 'Tooth thickness at the addendum pitch circle',
                        formula:
                            's = d_a \\left(\\frac{s_b}{d_b} + inv(\\alpha_a) \\right)',
                        valueLeft: data.GearData?.ThicknessTip,
                        valueRight: data.PinionData?.ThicknessTip,
                        useColumnSpan: false,
                    },
                    {
                        key: '4-5',
                        name: 'Angle of tooth tip',
                        formula:
                            '\\alpha_a = \\arccos{\\left(\\frac{d}{d_a} \\cos{\\alpha} \\right)}',
                        valueLeft: data.GearData?.AngleTip,
                        valueRight: data.PinionData?.AngleTip,
                        useColumnSpan: false,
                    },
                ],
            },
        ];

        return Result;
    }
}
