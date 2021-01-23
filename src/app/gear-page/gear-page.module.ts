import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared-module/shared.module';

import { GearPageRoutingModule } from './gear-page-routing.module';
import { GearPageComponent } from './home/gear-page.component';
import { ZorroAntdModule } from '../app-zorro.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GearPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    GearPageRoutingModule,
    ZorroAntdModule
  ]
})
export class GearPageModule { }
