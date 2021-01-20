import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared-module/shared.module';

import { GearPageRoutingModule } from './gear-page-routing.module';
import { GearPageComponent } from './home/gear-page.component';

@NgModule({
  declarations: [
    GearPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GearPageRoutingModule
  ]
})
export class GearPageModule { }
