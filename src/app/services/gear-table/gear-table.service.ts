import { Injectable } from '@angular/core';
import { CalculationsResultsData } from 'src/app/models/gear-parameters.model';
import { TableDataRow } from 'src/app/models/gear-tables.model';

@Injectable({
    providedIn: 'root',
})
export class GearTableService {
    constructor() {}

    getTableData(data: CalculationsResultsData): TableDataRow[] {
        if (data == undefined) {
            throw new Error(
                '[getTableData] Required data has not been provided'
            );
        }

        let Result: TableDataRow[] = [
            {
                name: 'Module',
                formula: 'm',
                value: data.MechanismData.Module,
                areValuesShared: true,
            },
            {
                name: 'Number of teeth',
                formula: 'z',
                value: data.GearData.NumberOfTeeth,
                valueSecondary: data.PinionData.NumberOfTeeth,
                areValuesShared: false,
            },
            {
                name: 'Profile shift coefficients',
                formula: 'x',
                value: data.GearData.ShiftCoefficient,
                valueSecondary: data.PinionData.ShiftCoefficient,
                areValuesShared: false,
            },
            {
                name: 'Pressure angle',
                formula: '\\alpha',
                value: data.MechanismData.PressureAngle,
                areValuesShared: true,
            },
            {
                name: 'Operating pressure angle',
                formula:
                    "\\alpha' = inverseInvolute \\left(2\\tan{\\alpha}\\frac{x_1+x_2}{z_1+z_2}+inv{\\alpha} \\right)",
                value: data.MechanismData.OperatingPressureAngle,
                areValuesShared: true,
            },
            {
                name: 'Transmission ratio',
                formula: 'i = \\frac{z_2}{z_1}',
                value: data.MechanismData.TransmissionRatio,
                areValuesShared: true,
            },
            {
                name: 'Center distance modification coefficient',
                formula:
                    "y = \\frac{z_1+z_2}{2} \\left( \\frac{\\cos{\\alpha}}{\\cos{\\alpha'}}-1 \\right)",
                value: data.MechanismData.CenterDistanceCoefficient,
                areValuesShared: true,
            },
            {
                name: 'Center distance',
                formula: 'a = \\left(\\frac{z_1+z_2}{2} + y \\right) m',
                value: data.MechanismData.CenterDistance,
                areValuesShared: true,
            },
            {
                name: 'Reference pitch circle diameter',
                formula: 'd = zm',
                value: data.GearData.ReferencePitchDiameter,
                valueSecondary: data.PinionData.ReferencePitchDiameter,
                areValuesShared: false,
            },
            {
                name: 'Base circle diameter',
                formula: 'd_b = d\\cos{\\alpha}',
                value: data.GearData.BaseCircleDiameter,
                valueSecondary: data.PinionData.BaseCircleDiameter,
                areValuesShared: false,
            },
            {
                name: 'Operating pitch circle diameter',
                formula: "d' = \\frac{d_b}{\\cos{\\alpha'}}",
                value: data.GearData.OperatingPitchDiameter,
                valueSecondary: data.PinionData.OperatingPitchDiameter,
                areValuesShared: false,
            },
            {
                name: 'Addendum circle diameter',
                formula: 'd_a = d + 2h_a',
                value: data.GearData.AddendumDiameter,
                valueSecondary: data.PinionData.AddendumDiameter,
                areValuesShared: false,
            },
            {
                name: 'Dedendum circle diameter',
                formula: 'd_f = d - 2h',
                value: data.GearData.DedendumDiameter,
                valueSecondary: data.PinionData.DedendumDiameter,
                areValuesShared: false,
            },
            {
                name: 'Pitch',
                formula: 'p = \\pi m',
                value: data.MechanismData.Pitch,
                areValuesShared: true,
            },
            {
                name: 'Fillet radius',
                formula: '\\rho = 0.38 m',
                value: data.MechanismData.FilletRadius,
                areValuesShared: true,
            },
            {
                name: 'Tooth thickness at the reference pitch circle',
                formula:
                    "s = m \\left(\\frac{1}{2} \\pi + 2x + \\tan{\\alpha'} \\right)",
                value: data.GearData.ThicknessReference,
                valueSecondary: data.PinionData.ThicknessReference,
                areValuesShared: false,
            },
            {
                name: 'Tooth thickness at the operating pitch circle',
                formula:
                    "s_w = d' \\left(\\frac{s}{d} + inv(\\alpha) - inv(\\alpha') \\right)",
                value: data.GearData.ThicknessOperating,
                valueSecondary: data.PinionData.ThicknessOperating,
                areValuesShared: false,
            },
            {
                name: 'Tooth thickness at the base circle',
                formula:
                    "s = d_b \\left(\\frac{s_w}{d_w} + inv(\\alpha') \\right)",
                value: data.GearData.ThicknessBase,
                valueSecondary: data.PinionData.ThicknessBase,
                areValuesShared: false,
            },
            {
                name: 'Tooth thickness at the addendum pitch circle',
                formula:
                    's = d_a \\left(\\frac{s_b}{d_b} + inv(\\alpha_a) \\right)',
                value: data.GearData.ThicknessTip,
                valueSecondary: data.PinionData.ThicknessTip,
                areValuesShared: false,
            },
            {
                name: 'Angle of tooth tip',
                formula:
                    '\\alpha_a = \\arccos{\\left(\\frac{d}{d_a} \\cos{\\alpha} \\right)}',
                value: data.GearData.AngleTip,
                valueSecondary: data.PinionData.AngleTip,
                areValuesShared: false,
            },
            {
                name: 'Contact Ratio',
                formula:
                    '\\epsilon = \\frac{\\sqrt{(\\frac{d_{a1}}{2})^2 - (\\frac{d_{b1}}{2})^2} + \\sqrt{(\\frac{d_{a2}}{2})^2 - (\\frac{d_{b2}}{2})^2} + a \\sin{\\alpha}}{\\pi m \\cos{\\alpha}}',
                value: data.MechanismData.ContactRatio,
                areValuesShared: true,
            },
        ];

        return Result;
    }
}
