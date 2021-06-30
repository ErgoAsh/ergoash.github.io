import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared-module/shared.module';
import { GearPageRoutingModule } from './gear-page-routing.module';
import { GearPageComponent } from './home/gear-page.component';
import { GearTableComponent } from './gear-table/gear-table.component';

import { ZorroAntdModule } from '../app-zorro.module';
import { KatexModule } from 'ng-katex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import {
    CaretRightOutline,
    PauseCircleOutline,
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [CaretRightOutline, PauseCircleOutline];

@NgModule({
    declarations: [GearPageComponent, GearTableComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        GearPageRoutingModule,
        ZorroAntdModule,
        NzIconModule.forRoot(icons),
        KatexModule,
    ],
})
export class GearPageModule {}
