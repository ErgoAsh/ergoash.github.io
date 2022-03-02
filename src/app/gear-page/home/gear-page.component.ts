import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GearVisualizationService } from 'src/app/services/gear-visualization/gear-visualization.service';
import { GearGeometryService } from 'src/app/services/gear-geometry/gear-geometry.service';
import { GearParametersService } from 'src/app/services/gear-parameters/gear-parameters.service';
import { CalculationsResultsData } from 'src/app/models/gear-parameters.model';
import { GearTableComponent } from '../gear-table/gear-table.component';
import { PlayerState } from 'src/app/models/gear-player-state.model';

import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';

import * as d3 from 'd3';

export interface GearMechanismInputData {
    m: number;
    z1: number;
    z2: number;
    x1: number;
    x2: number;
}

@Component({
    selector: 'app-gear-page',
    templateUrl: './gear-page.component.html',
    styleUrls: ['./gear-page.component.scss'],
})
export class GearPageComponent implements AfterViewInit, OnInit {
    @ViewChild('figure')
    figure!: ElementRef<HTMLDivElement>;

    @ViewChild(GearTableComponent)
    tableComponent!: GearTableComponent;

    dataForm!: FormGroup;
    dataModel: GearMechanismInputData = {
        m: 11,
        z1: 13,
        z2: 47,
        x1: 0.8,
        x2: 0.6032,
    } as GearMechanismInputData;

    sliderScale = 7;
    mechanismData?: CalculationsResultsData;

    gearPath?: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
    pinionPath?: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;

    pinionRotationAngle = 0;
    gearRotationAngle = 0;

    hasDataBeenCalculated = false;

    constructor(
        private geometryService: GearGeometryService,
        private parametersService: GearParametersService,
        private visualService: GearVisualizationService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.dataForm = this.formBuilder.group({
            m: [this.dataModel.m, [Validators.required, Validators.min(0.001)]],
            z1: [this.dataModel.z1, [Validators.required, Validators.min(10)]],
            z2: [this.dataModel.z2, [Validators.required, Validators.min(10)]],
            x1: [
                this.dataModel.x1,
                [Validators.required, Validators.min(-2), Validators.max(2)],
            ],
            x2: [
                this.dataModel.x2,
                [Validators.required, Validators.min(-2), Validators.max(2)],
            ],
        });
    }

    ngAfterViewInit(): void {
        // Hack making NG-ZORRO tab flex box as tall as it's supposed to
        const cnt = document.querySelector('.ant-tabs-content') as HTMLElement;
        const nav = document.querySelector('.ant-tabs-nav') as HTMLElement;

        cnt.style.height = '100%';
        nav.style.margin = '0px';

        this.visualService.defaultFigure = d3.select('#svg').append('g');
    }

    submitForm(): void {
        d3.select('g').remove();

        this.dataModel = this.dataForm.value;
        this.mechanismData = this.parametersService.calculateCouplingParameters(
            this.dataModel.m,
            this.dataModel.z1,
            this.dataModel.z2,
            this.dataModel.x1,
            this.dataModel.x2
        );

        this.addPathGroup(
            this.mechanismData.ActionPosition.x,
            this.mechanismData.ActionPosition.y
        );

        const result = this.geometryService.generateGearMechanismPath(
            this.mechanismData
        );
        this.hasDataBeenCalculated = true;

        for (const item of result.MechanismGeometry || []) {
            const pathElement = this.visualService.showElement(
                item.path,
                undefined,
                item.attributes
            );

            switch (item?.name) {
                case 'pinion':
                    this.pinionPath = pathElement;
                    break;
                case 'gear':
                    this.gearPath = pathElement;
                    break;
            }
        }
    }

    onSliderChange(value: number): void {
        this.updateGroupTransform(
            value,
            value,
            this.mechanismData?.ActionPosition.x,
            this.mechanismData?.ActionPosition.y
        );
        this.sliderScale = value;
    }

    updateGroupTransform(
        scaleX?: number,
        scaleY?: number,
        centerX?: number,
        centerY?: number
    ): void {
        if (
            scaleX === undefined ||
            scaleY === undefined ||
            centerX === undefined ||
            centerY === undefined
        ) {
            throw new Error('[updateGroupTransform] data has not been found');
        }

        const x =
            (0.5 * this.figure.nativeElement.offsetWidth) / scaleX - centerX;
        const y =
            (0.5 * this.figure.nativeElement.offsetHeight) / scaleY - centerY;

        const translate = 'translate(' + x + ', ' + y + ')';
        const scaleString = 'scale(' + scaleX + ', ' + scaleY + ')';

        this.visualService.defaultFigure?.attr(
            'transform',
            scaleString + ' ' + translate
        );
    }

    addPathGroup(centerX: number, centerY: number): void {
        this.visualService.defaultFigure = d3.select('#svg').append('g');

        this.updateGroupTransform(
            this.sliderScale,
            this.sliderScale,
            centerX,
            centerY
        );
    }

    startAnimation(previousState: PlayerState): void {
        if (this.pinionPath && this.gearPath) {
            if (previousState === PlayerState.PAUSED) {
                this.visualService.startAnimation(
                    this.pinionPath,
                    this.gearPath,
                    this.mechanismData?.MechanismData?.TransmissionRatio,
                    this.mechanismData?.PinionPosition,
                    this.mechanismData?.GearPosition,
                    this.pinionRotationAngle,
                    this.gearRotationAngle
                );
            } else if (previousState === PlayerState.STOPPED) {
                this.visualService.startAnimation(
                    this.pinionPath,
                    this.gearPath,
                    this.mechanismData?.MechanismData?.TransmissionRatio,
                    this.mechanismData?.PinionPosition,
                    this.mechanismData?.GearPosition
                );
            }
        }
    }

    stopAnimation(): void {
        if (this.pinionPath && this.gearPath) {
            this.visualService.stopAnimation(this.pinionPath, this.gearPath);
            this.gearRotationAngle = 0;
            this.pinionRotationAngle = 0;
        }
    }

    pauseAnimation(): void {
        if (this.pinionPath && this.gearPath) {
            const result = this.visualService.pauseAnimation(
                this.pinionPath,
                this.gearPath
            );

            this.pinionRotationAngle = result?.pinionAnimationAngle || 0;
            this.gearRotationAngle = result?.gearAnimationAngle || 0;
        }
    }
}
