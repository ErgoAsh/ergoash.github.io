import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePageComponent } from './home/schedule-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ZorroAntdModule } from '../app-zorro.module';
import { SharedModule } from '../shared-module/shared.module';
import { SchedulePageRoutingModule } from './schedule-page-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ZorroAntdModule,
        SchedulePageRoutingModule,
    ],
    declarations: [SchedulePageComponent],
})
export class SchedulePageModule {}
