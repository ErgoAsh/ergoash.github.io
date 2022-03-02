import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared-module/shared.module';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './home/landing-page.component';

@NgModule({
    declarations: [LandingPageComponent],
    imports: [CommonModule, SharedModule, LandingPageRoutingModule],
})
export class LandingPageModule {}
