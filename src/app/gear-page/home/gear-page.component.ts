import {
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
        let width = this.figure.nativeElement.clientWidth;
        let height = this.figure.nativeElement.clientHeight;

        let translate = 'translate(' + width / 2 + ', ' + height / 2 + ')';
        let scale = 'scale(' + 4 + ', ' + 4 + ')';

        this.gearService.defaultFigure = d3
            .select('#figure')
            .append('svg')
            .attr('class', 'canvas-grid')
            .style('height', height)
            .style('width', width)
            .attr('align', 'center')
            .append('g')
            .attr('transform', translate + ' ' + scale);

        this.tick();
    }

    tick() {
        //requestAnimationFrame(() => this.tick());
        //const ctx = this.context;
        //ctx.clearRect( 0, 0, 600, 400 );
    }

    submitForm(): void {
        this.dataModel = this.dataForm.value;
        let parameters = this.gearService.calculateCouplingParameters(
            this.dataModel.m,
            this.dataModel.z1,
            this.dataModel.z2,
            this.dataModel.x1,
            this.dataModel.x2
        );
        let result = this.gearService.generateGearMechanismPath(parameters);

        for (let item of result.MechanismGeometry || []) {
            this.gearService.showElement(item.path, undefined, item.attributes);
        }
    }
}
