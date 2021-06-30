import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CalculationsResultsData } from 'src/app/models/gear-parameters.model';
import { Point } from 'src/app/models/math-utils.model';

import { GearPageComponent } from '../home/gear-page.component';
import { GearTableComponent } from './gear-table.component';
import { ZorroAntdModule } from 'src/app/app-zorro.module';
import { NzIconTestModule } from 'src/app/app-zorro-tests-module';

describe('GearTableComponent', () => {
    let hostComponent: GearPageComponent;
    let hostFixture: ComponentFixture<GearPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GearTableComponent, GearPageComponent],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                ZorroAntdModule,
                NzIconTestModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        hostFixture = TestBed.createComponent(GearPageComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it('should create host', () => {
        expect(hostComponent).toBeTruthy();
    });

    it('should create component', () => {
        expect(hostComponent.tableComponent).toBeTruthy();
    });

    it('should know if data has been passed', () => {
        const mockData = {
            PinionPosition: new Point(0, 0),
            GearPosition: new Point(0, 0),
            ActionPosition: new Point(0, 0),
        } as CalculationsResultsData;

        expect(hostComponent.tableComponent.hasReceivedData).toBeFalsy();

        hostComponent.mechanismData = mockData;
        hostFixture.detectChanges();

        expect(hostComponent.tableComponent.hasReceivedData).toBeTruthy();
    });
});
