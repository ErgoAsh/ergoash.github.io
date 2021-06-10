import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
    providedIn: 'root',
})
export class GearVisualizationService {
    constructor() {}

    private _defaultFigure:
        | d3.Selection<SVGGElement, unknown, HTMLElement, any>
        | undefined;

    get defaultFigure() {
        return this._defaultFigure;
    }

    set defaultFigure(value) {
        this._defaultFigure = value;
    }

    showElement(
        element: d3.Path,
        figure:
            | d3.Selection<SVGGElement, unknown, HTMLElement, any>
            | undefined = undefined,
        attributes: { key: string; value: string }[] | undefined = undefined
    ) {
        let result = null;

        if (figure == undefined) {
            if (this.defaultFigure == undefined)
                throw new Error('Default SVG figure has not been specified');

            result = this.defaultFigure
                .append('path')
                .attr('d', element.toString());
        } else {
            result = figure.append('path').attr('d', element.toString());
        }

        if (attributes == undefined) {
            result.attr('stroke', 'black');
        } else {
            for (let entry of attributes) {
                result = result.attr(entry.key, entry.value);
            }
        }

        return result
            .attr('fill', 'none')
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round');
    }

    startAnimation(
        pinion: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
        gear: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
        transmissionRatio: number,
        center_x: number,
        center_y: number
    ) {
        pinion
            .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attrTween('transform', (datum) => {
                return (time) => {
                    return d3.interpolateString(
                        'rotation(0, ' + center_x + ', ' + center_y + ')',
                        'rotation(360, ' + center_x + ', ' + center_y + ')'
                    )(time);
                };
            })
            .on('end', () =>
                this.startAnimation(
                    pinion,
                    gear,
                    transmissionRatio,
                    center_x,
                    center_y
                )
            );

        gear.transition()
            .duration(5000 * transmissionRatio)
            .ease(d3.easeLinear)
            .attrTween('transform', (datum) => {
                return (time) => {
                    return d3.interpolateString(
                        'rotation(0, ' + center_x + ', ' + center_y + ')',
                        'rotation(360, ' + center_x + ', ' + center_y + ')'
                    )(time);
                };
            })
            .on('end', () =>
                this.startAnimation(
                    pinion,
                    gear,
                    transmissionRatio,
                    center_x,
                    center_y
                )
            );
    }

    pauseAnimation(
        pinion: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
        gear: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
    ) {}

    stopAnimation(
        pinion: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
        gear: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
    ) {}

    resumeAnimation(
        pinion: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
        gear: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
        pinionRotationAngle: number,
        gearRotationAngle: number
    ) {}
}
