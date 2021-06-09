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

    sliderValue = 0;
    hasStarted = false;

    constructor(
        private gearService: GearCouplingCalculationService,
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
        //d3.select('svg').selectChild().remove();

        this.gearService.defaultFigure = d3.select('#svg').append('g');

        this.tick();
    }

    tick() {
        //requestAnimationFrame(() => this.tick());
        //const ctx = this.context;
        //ctx.clearRect( 0, 0, 600, 400 );
    }

    addSVGGroup(center_x: number, center_y: number) {
        this.gearService.defaultFigure = d3.select('#svg').append('g');

        let width = this.figure.nativeElement.offsetWidth / 2 - center_x;
        let height = this.figure.nativeElement.offsetHeight / 2 - center_y;

        let translate = 'translate(' + width + ', ' + height + ')';
        let scale = 'scale(' + 4 + ', ' + 4 + ')';

        this.gearService.defaultFigure?.attr(
            'transform',
            translate + ' ' + scale
        );

        //TODO set&get transform
        //TODO set&get scale
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

        this.addSVGGroup(parameters.MechanismData.CenterDistance, 0);

        let result = this.gearService.generateGearMechanismPath(parameters);
        for (let item of result.MechanismGeometry || []) {
            this.gearService.showElement(item.path, undefined, item.attributes);
        }
    }
}
