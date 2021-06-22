import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GearVisualizationService } from 'src/app/services/gear-visualization/gear-visualization.service';
import { GearGeometryService } from 'src/app/services/gear-geometry/gear-geometry.service';
import { GearParametersService } from 'src/app/services/gear-parameters/gear-parameters.service';
import { CalculationsResultsData } from 'src/app/models/gear-parameters.model';

import * as d3 from 'd3';
import * as Two from 'twojs-ts';

export interface GearMechanismInputData {
    m: number;
    z1: number;
    z2: number;
    x1: number;
    x2: number;
}

export enum PlayerState {
    PAUSED,
    PLAYING,
    STOPPED,
}

@Component({
    selector: 'gear-page',
    templateUrl: './gear-page.component.html',
    styleUrls: ['./gear-page.component.scss'],
})
export class GearPageComponent implements AfterViewInit, OnInit {
    @ViewChild('figure')
    figure!: ElementRef<HTMLDivElement>;

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

    playerState = PlayerState.STOPPED;
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

    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            m: [this.dataModel.m, [Validators.required, Validators.min(0.001)]],
            z1: [this.dataModel.z1, [Validators.required, Validators.min(10)]],
            z2: [this.dataModel.z2, [Validators.required, Validators.min(10)]],
            x1: [
                this.dataModel.x1,
                [Validators.required, Validators.min(-1), Validators.max(1)],
            ],
            x2: [
                this.dataModel.x2,
                [Validators.required, Validators.min(-1), Validators.max(1)],
            ],
        });
    }

    ngAfterViewInit() {
        this.visualService.defaultFigure = d3.select('#svg').append('g');
    }

    onSliderChange(value: number) {
        this.updateGroupTransform(
            value,
            value,
            this.mechanismData?.ActionPosition.x,
            this.mechanismData?.ActionPosition.y
        );
    }

    updateGroupTransform(
        scale_x?: number,
        scale_y?: number,
        center_x?: number,
        center_y?: number
    ) {
        if (
            scale_x == undefined ||
            scale_y == undefined ||
            center_x == undefined ||
            center_y == undefined
        ) {
            throw new Error('[updateGroupTransform] data has not been found');
        }

        let x =
            (this.figure.nativeElement.offsetWidth - center_x * scale_x * 2) /
            2 /
            scale_x;
        let y =
            (this.figure.nativeElement.offsetHeight - center_y * scale_y * 2) /
            2 /
            scale_y;

        let translate = 'translate(' + x + ', ' + y + ')';
        let scaleString = 'scale(' + scale_x + ', ' + scale_y + ')';

        this.visualService.defaultFigure?.attr(
            'transform',
            scaleString + ' ' + translate
        );
    }

    addPathGroup(center_x: number, center_y: number) {
        this.visualService.defaultFigure = d3.select('#svg').append('g');

        this.updateGroupTransform(
            this.sliderScale,
            this.sliderScale,
            center_x,
            center_y
        );
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

        let result = this.geometryService.generateGearMechanismPath(
            this.mechanismData
        );
        this.hasDataBeenCalculated = true;

        for (let item of result.MechanismGeometry || []) {
            let pathElement = this.visualService.showElement(
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

    isPlaying() {
        return this.playerState == PlayerState.PLAYING;
    }

    hasPaused() {
        return this.playerState == PlayerState.PAUSED;
    }

    hasStopped() {
        return this.playerState == PlayerState.STOPPED;
    }

    startAnimation() {
        if (this.pinionPath && this.gearPath) {
            if (this.hasPaused()) {
                this.visualService.startAnimation(
                    this.pinionPath,
                    this.gearPath,
                    this.mechanismData?.MechanismData.TransmissionRatio,
                    this.mechanismData?.PinionPosition,
                    this.mechanismData?.GearPosition,
                    this.pinionRotationAngle,
                    this.gearRotationAngle
                );
            } else if (this.hasStopped()) {
                this.visualService.startAnimation(
                    this.pinionPath,
                    this.gearPath,
                    this.mechanismData?.MechanismData.TransmissionRatio,
                    this.mechanismData?.PinionPosition,
                    this.mechanismData?.GearPosition
                );
            }
            this.playerState = PlayerState.PLAYING;
        }
    }

    stopAnimation() {
        if (this.pinionPath && this.gearPath) {
            this.visualService.stopAnimation(this.pinionPath, this.gearPath);
            this.gearRotationAngle = 0;
            this.pinionRotationAngle = 0;
        }

        this.playerState = PlayerState.STOPPED;
    }

    pauseAnimation() {
        if (this.pinionPath && this.gearPath) {
            let result = this.visualService.pauseAnimation(
                this.pinionPath,
                this.gearPath
            );

            this.pinionRotationAngle = result?.pinionAnimationAngle || 0;
            this.gearRotationAngle = result?.gearAnimationAngle || 0;
        }

        this.playerState = PlayerState.PAUSED;
    }
}
