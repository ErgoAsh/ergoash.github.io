import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GearCouplingCalculationService } from '../services/gear-coupling-dimension.service';

import * as d3 from 'd3';
import { Point } from '../services/gear-coupling-dimension.model';

export interface GearMechanismInputData {
    m: number;
    z1: number;
    z2: number;
    x1: number;
    x2: number;
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

    sliderValue = 7;
    hasStarted = false;
    mechanismCenter: Point = new Point(0, 0);

    constructor(
        private gearService: GearCouplingCalculationService,
        private formBuilder: FormBuilder
    ) {}

    onSliderChange(value: number) {
        this.updateGroupTransform(
            value,
            this.mechanismCenter.x,
            this.mechanismCenter.y
        );
    }

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
        //d3.select('svg').selectChild().remove();

        this.gearService.defaultFigure = d3.select('#svg').append('g');

        this.tick();
    }

    tick() {
        //requestAnimationFrame(() => this.tick());
        //const ctx = this.context;
        //ctx.clearRect( 0, 0, 600, 400 );
    }

    updateGroupTransform(scale: number, center_x: number, center_y: number) {
        let x =
            (this.figure.nativeElement.offsetWidth - center_x * scale * 2) /
            2 /
            scale;
        let y =
            (this.figure.nativeElement.offsetHeight - center_y * scale * 2) /
            2 /
            scale;

        let translate = 'translate(' + x + ', ' + y + ')';
        let scaleString = 'scale(' + scale + ', ' + scale + ')';

        this.gearService.defaultFigure?.attr(
            'transform',
            scaleString + ' ' + translate
        );
    }

    addSVGGroup(center_x: number, center_y: number) {
        this.gearService.defaultFigure = d3.select('#svg').append('g');
        this.mechanismCenter = new Point(center_x, center_y);

        this.updateGroupTransform(this.sliderValue, center_x, center_y);
    }

    submitForm(): void {
        d3.select('g').remove();

        this.dataModel = this.dataForm.value;
        let parameters = this.gearService.calculateCouplingParameters(
            this.dataModel.m,
            this.dataModel.z1,
            this.dataModel.z2,
            this.dataModel.x1,
            this.dataModel.x2
        );

        this.addSVGGroup(
            parameters.ActionPosition.x,
            parameters.ActionPosition.y
        );

        let result = this.gearService.generateGearMechanismPath(parameters);
        for (let item of result.MechanismGeometry || []) {
            this.gearService.showElement(item.path, undefined, item.attributes);
        }
    }
}
