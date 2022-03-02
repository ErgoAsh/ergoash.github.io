import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconTestModule } from 'src/app/app-zorro-tests-module';
import { ZorroAntdModule } from 'src/app/app-zorro.module';

import { GearPageComponent } from './gear-page.component';

describe('GearHomeComponentComponent', () => {
    let component: GearPageComponent;
    let fixture: ComponentFixture<GearPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GearPageComponent],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                ZorroAntdModule,
                NzIconTestModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GearPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
