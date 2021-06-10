import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as d3 from 'd3';
import { Point } from 'src/app/models/math-utils.model';
import { GearVisualizationService } from 'src/app/services/animation/gear-visualization.service';
import { GearGeometryService } from 'src/app/services/gear-geometry/gear-geometry.service';
import { GearParametersService } from 'src/app/services/gear-parameters/gear-parameters.service';

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
    mechanismCenter: Point = new Point(0, 0);

    playerState = PlayerState.STOPPED;
    pinionRotationAngle = 0;
    gearRotationAngle = 0;

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
            this.mechanismCenter.x,
            this.mechanismCenter.y
        );
    }

    updateGroupTransform(
        scale_x: number,
        scale_y: number,
        center_x: number,
        center_y: number
    ) {
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
        this.mechanismCenter = new Point(center_x, center_y);

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
        let parameters = this.parametersService.calculateCouplingParameters(
            this.dataModel.m,
            this.dataModel.z1,
            this.dataModel.z2,
            this.dataModel.x1,
            this.dataModel.x2
        );

        this.addPathGroup(
            parameters.ActionPosition.x,
            parameters.ActionPosition.y
        );

        let result = this.geometryService.generateGearMechanismPath(parameters);
        for (let item of result.MechanismGeometry || []) {
            this.visualService.showElement(
                item.path,
                undefined,
                item.attributes
            );
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

    startAnimation() {}
}
