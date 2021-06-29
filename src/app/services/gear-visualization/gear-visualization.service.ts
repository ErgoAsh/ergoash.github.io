import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Point } from 'src/app/models/math-utils.model';

@Injectable({
    providedIn: 'root',
})
export class GearVisualizationService {
    constructor() {}

    private _pinionRotation?: string;
    private _gearRotation?: string;

    private _defaultFigure?: d3.Selection<
        SVGGElement,
        unknown,
        HTMLElement,
        any
    >;

    get defaultFigure():
        | d3.Selection<SVGGElement, unknown, HTMLElement, any>
        | undefined {
        return this._defaultFigure;
    }

    set defaultFigure(value) {
        this._defaultFigure = value;
    }

    showElement(
        element: d3.Path,
        figure?: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        attributes?: { key: string; value: string }[]
    ): d3.Selection<SVGPathElement, unknown, HTMLElement, any> {
        let result = null;

        if (figure === undefined) {
            if (this.defaultFigure === undefined)
                throw new Error('Default SVG figure has not been specified');

            result = this.defaultFigure
                .append('path')
                .attr('d', element.toString());
        } else {
            result = figure.append('path').attr('d', element.toString());
        }

        if (attributes === undefined) {
            result.attr('stroke', 'black');
        } else {
            for (const entry of attributes) {
                result = result.attr(entry.key, entry.value);
            }
        }

        return result
            .attr('fill', 'none')
            .attr('stroke-linecap', 'round') // TODO remove for circles
            .attr('stroke-linejoin', 'round');
    }

    startAnimation(
        pinion: d3.Selection<SVGPathElement, unknown, HTMLElement, any>,
        gear: d3.Selection<SVGPathElement, unknown, HTMLElement, any>,
        transmissionRatio?: number,
        pinionCenter?: Point,
        gearCenter?: Point,
        pinionRotationAngle: number = 0,
        gearRotationAngle: number = 0
    ): void {
        if (
            transmissionRatio === undefined ||
            pinionCenter === undefined ||
            gearCenter === undefined
        ) {
            throw new Error('[startAnimation] data has not been found');
        }

        pinion.attr(
            'transform',
            'rotate(' +
                pinionRotationAngle +
                ', ' +
                pinionCenter.x +
                ', ' +
                pinionCenter.y +
                ')'
        );

        gear.attr(
            'transform',
            'rotate(' +
                gearRotationAngle +
                ', ' +
                gearCenter.x +
                ', ' +
                gearCenter.y +
                ')'
        );

        pinion
            .transition()
            .duration(60 * 1000)
            .ease(d3.easeLinear)
            .attrTween('transform', (datum) => {
                return (time) => {
                    this._pinionRotation = d3.interpolateString(
                        'rotate(' +
                            pinionRotationAngle +
                            ', ' +
                            pinionCenter.x +
                            ', ' +
                            pinionCenter.y +
                            ')',
                        'rotate(360, ' +
                            pinionCenter.x +
                            ', ' +
                            pinionCenter.y +
                            ')'
                    )(time);
                    return this._pinionRotation;
                };
            })
            .on('end', () =>
                this.startAnimation(
                    pinion,
                    gear,
                    transmissionRatio,
                    pinionCenter,
                    gearCenter
                )
            );

        gear.transition()
            .duration(60 * 1000 * transmissionRatio)
            .ease(d3.easeLinear)
            .attrTween('transform', (datum) => {
                return (time) => {
                    this._gearRotation = d3.interpolateString(
                        'rotate(' +
                            gearRotationAngle +
                            ', ' +
                            gearCenter.x +
                            ', ' +
                            gearCenter.y +
                            ')',
                        'rotate(-360, ' +
                            gearCenter.x +
                            ', ' +
                            gearCenter.y +
                            ')'
                    )(time);
                    return this._gearRotation;
                };
            })
            .on('end', () =>
                this.startAnimation(
                    pinion,
                    gear,
                    transmissionRatio,
                    pinionCenter,
                    gearCenter
                )
            );
    }

    pauseAnimation(
        pinion: d3.Selection<SVGPathElement, unknown, HTMLElement, any>,
        gear: d3.Selection<SVGPathElement, unknown, HTMLElement, any>
    ): { pinionAnimationAngle?: number; gearAnimationAngle?: number } | null {
        if (
            this._pinionRotation === undefined ||
            this._gearRotation === undefined
        ) {
            throw new Error('[pauseAnimation] Rotation object is undefined');
        }

        const pinionAngle = this._pinionRotation.match(
            /\d+\.\d+|\d+\b|\d+(?=\w)/g
        );

        const gearAngle = this._gearRotation.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);

        pinion.interrupt();
        gear.interrupt();

        if (pinionAngle !== null && gearAngle !== null) {
            return {
                pinionAnimationAngle: parseFloat(pinionAngle[0]),
                gearAnimationAngle: -parseFloat(gearAngle[0]),
            };
        }

        return null;
    }

    stopAnimation(
        pinion: d3.Selection<SVGPathElement, unknown, HTMLElement, any>,
        gear: d3.Selection<SVGPathElement, unknown, HTMLElement, any>
    ): void {
        pinion.interrupt();
        gear.interrupt();

        pinion.attr('transform', '');
        gear.attr('transform', '');
    }
}
