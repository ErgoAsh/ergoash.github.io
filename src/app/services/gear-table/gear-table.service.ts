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

        const result: TableDataRow[] = [
            {
                key: '1',
                name: 'Mechanism basic data',
                isExpanded: false,
                level: 0,
                children: [
                    {
                        key: '1-1',
                        name: 'Module',
                        formula: 'm',
                        valueLeft: data.MechanismData?.Module,
                        unit: 'mm',
                        roundDigit: 0,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '1-2',
                        name: 'Number of teeth',
                        formula: 'z',
                        valueLeft: data.GearData?.NumberOfTeeth,
                        valueRight: data.PinionData?.NumberOfTeeth,
                        unit: '-',
                        roundDigit: 0,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '1-3',
                        name: 'Pressure angle',
                        formula: '\\alpha',
                        roundDigit: 2,
                        valueLeft: data.MechanismData?.PressureAngle,
                        unit: 'deg',
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '1-4',
                        name: 'Operating pressure angle',
                        formula:
                            "\\alpha' = \\textrm{inverseInv} \\left(2\\tan{\\alpha}\\frac{x_1+x_2}{z_1+z_2}+\\textrm{inv}\\alpha \\right)",
                        valueLeft: data.MechanismData?.OperatingPressureAngle,
                        unit: 'deg',
                        roundDigit: 5,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '1-5',
                        name: 'Transmission ratio',
                        formula: 'i = \\frac{z_2}{z_1}',
                        valueLeft: data.MechanismData?.TransmissionRatio,
                        unit: '-',
                        roundDigit: 3,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '1-6',
                        name: 'Contact ratio',
                        formula:
                            '\\varepsilon = \\frac{\\sqrt{(\\frac{d_{a1}}{2})^2 - (\\frac{d_{b1}}{2})^2} + \\sqrt{(\\frac{d_{a2}}{2})^2 - (\\frac{d_{b2}}{2})^2} + a \\sin{\\alpha}}{\\pi m \\cos{\\alpha}}',
                        valueLeft: data.MechanismData?.ContactRatio,
                        unit: '-',
                        roundDigit: 3,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                ],
            },
            {
                key: '2',
                name: 'Geometrical parameters',
                isExpanded: false,
                level: 0,
                children: [
                    {
                        key: '2-1',
                        name: 'Profile shift coefficients',
                        formula: 'x',
                        valueLeft: data.GearData?.ShiftCoefficient,
                        valueRight: data.PinionData?.ShiftCoefficient,
                        unit: '-',
                        roundDigit: 4,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '2-2',
                        name: 'Center distance modification coefficient',
                        formula:
                            "y = \\frac{z_1+z_2}{2} \\left( \\frac{\\cos{\\alpha}}{\\cos{\\alpha'}}-1 \\right)",
                        valueLeft:
                            data.MechanismData?.CenterDistanceCoefficient,
                        unit: '-',
                        roundDigit: 3,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '2-3',
                        name: 'Center distance',
                        formula: 'a = \\left(\\frac{z_1+z_2}{2} + y \\right) m',
                        valueLeft: data.MechanismData?.CenterDistance,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '2-4',
                        name: 'Pitch (arc length)',
                        formula: 'p = \\pi m',
                        valueLeft: data.MechanismData?.CircularPitch,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '2-5',
                        name: 'Fillet radius',
                        formula: '\\rho = 0.38 m',
                        valueLeft: data.MechanismData?.FilletRadius,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                ],
            },
            {
                key: '3',
                name: 'Circle diameters',
                isExpanded: false,
                level: 0,
                children: [
                    {
                        key: '3-1',
                        name: 'Reference pitch circle diameter',
                        formula: 'd = zm',
                        valueLeft: data.GearData?.DiameterReference,
                        valueRight: data.PinionData?.DiameterReference,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '3-2',
                        name: 'Base circle diameter',
                        formula: 'd_b = d\\cos{\\alpha}',
                        valueLeft: data.GearData?.DiameterBase,
                        valueRight: data.PinionData?.DiameterBase,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '3-3',
                        name: 'Operating pitch circle diameter',
                        formula: "d' = \\frac{d_b}{\\cos{\\alpha'}}",
                        valueLeft: data.GearData?.DiameterWorking,
                        valueRight: data.PinionData?.DiameterWorking,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '3-4',
                        name: 'Addendum circle diameter',
                        formula: 'd_a = d + 2h_a',
                        valueLeft: data.GearData?.DiameterAddendum,
                        valueRight: data.PinionData?.DiameterAddendum,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '3-5',
                        name: 'Dedendum circle diameter',
                        formula: 'd_f = d - 2h_f',
                        roundDigit: 2,
                        valueLeft: data.GearData?.DiameterAddendum,
                        valueRight: data.PinionData?.DiameterAddendum,
                        unit: 'mm',
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                ],
            },
            {
                key: '4',
                name: 'Teeth geometry',
                isExpanded: false,
                level: 0,
                children: [
                    {
                        key: '4-1',
                        name: 'Tooth thickness at the addendum pitch circle',
                        formula:
                            's_a = d_a \\left(\\frac{s}{d} + \\textrm{inv}\\alpha - \\textrm{inv}\\alpha_a \\right)',
                        valueLeft: data.GearData?.ThicknessTip,
                        valueRight: data.PinionData?.ThicknessTip,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-2',
                        name: 'Tooth thickness at the operating pitch circle',
                        formula:
                            "s_w = d' \\left(\\frac{s}{d} + \\textrm{inv}\\alpha - \\textrm{inv}\\alpha' \\right)",
                        valueLeft: data.GearData?.ThicknessWorking,
                        valueRight: data.PinionData?.ThicknessWorking,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-3',
                        name: 'Tooth thickness at the reference pitch circle',
                        formula:
                            's = m \\left(\\frac{\\pi}{2} + 2 x \\tan{\\alpha} \\right)',
                        valueLeft: data.GearData?.ThicknessReference,
                        valueRight: data.PinionData?.ThicknessReference,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-4',
                        name: 'Tooth thickness at the base circle (no fillet assumed, theoretical if dedendum circle is bigger than base circle)',
                        formula:
                            's_b = d_b \\left(\\frac{s}{d} + \\textrm{inv}\\alpha \\right)',
                        valueLeft: data.GearData?.ThicknessBase,
                        valueRight: data.PinionData?.ThicknessBase,
                        unit: 'mm',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-5',
                        name: 'Pressure angle at tooth tip',
                        formula:
                            '\\alpha_a = \\arccos{\\left( \\frac{d_b}{d_a} \\right)}',
                        valueLeft: data.GearData?.PressureAngleTip,
                        valueRight: data.PinionData?.PressureAngleTip,
                        unit: 'deg',
                        roundDigit: 3,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-6',
                        name: 'Pressure angle at working circle',
                        formula:
                            "\\alpha' = \\textrm{inverseInv} \\left(2\\tan{\\alpha}\\frac{x_1+x_2}{z_1+z_2}+\\textrm{inv}\\alpha \\right)",
                        valueLeft: data.GearData?.PressureAngleWorking,
                        unit: 'deg',
                        roundDigit: 3,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-7',
                        name: 'Pressure angle at reference circle',
                        formula: '\\alpha',
                        valueLeft: data.GearData?.PressureAngleReference,
                        unit: 'deg',
                        roundDigit: 3,
                        useColumnSpan: true,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-8',
                        name: 'Width of tip (angle)',
                        formula: '\\varphi_a = \\frac{2 s_a}{d_a}',
                        valueLeft: data.GearData?.WidthAngleTip,
                        valueRight: data.PinionData?.WidthAngleTip,
                        unit: 'deg',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-9',
                        name: 'Width at working circle (angle)',
                        formula: "\\varphi' = \\frac{2 s_w}{d'}",
                        valueLeft: data.GearData?.WidthAngleWorking,
                        valueRight: data.PinionData?.WidthAngleWorking,
                        unit: 'deg',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-10',
                        name: 'Width at reference circle (angle)',
                        formula: '\\varphi = \\frac{2 s}{d}',
                        valueLeft: data.GearData?.WidthAngleReference,
                        valueRight: data.PinionData?.WidthAngleReference,
                        unit: 'deg',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                    {
                        key: '4-11',
                        name: 'Width at base circle (angle)',
                        formula: '\\varphi_b = \\frac{2 s_b}{d_b}',
                        valueLeft: data.GearData?.WidthAngleBase,
                        valueRight: data.PinionData?.WidthAngleBase,
                        unit: 'deg',
                        roundDigit: 2,
                        useColumnSpan: false,
                        isExpanded: false,
                        level: 1,
                    },
                ],
            },
        ];

        return result;
    }

    collapse(array: TableDataRow[], data: TableDataRow, $event: boolean): void {
        if (!$event) {
            if (data.children) {
                data.children.forEach((d) => {
                    const target = array.find((a) => a.key === d.key);
                    if (target) {
                        target.isExpanded = false;
                        this.collapse(array, target, false);
                    }
                });
            } else {
                return;
            }
        }
    }

    convertTreeToList(root: TableDataRow): TableDataRow[] {
        const stack: TableDataRow[] = [];
        const array: TableDataRow[] = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, isExpanded: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            if (node) {
                this.visitNode(node, hashMap, array);
                if (node.children) {
                    for (let i = node.children.length - 1; i >= 0; i--) {
                        stack.push({
                            ...node.children[i],
                            level: node.level + 1,
                            isExpanded: false,
                            parent: node,
                        });
                    }
                }
            }
        }

        return array;
    }

    visitNode(
        node: TableDataRow,
        hashMap: { [key: string]: boolean },
        array: TableDataRow[]
    ): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }
}
