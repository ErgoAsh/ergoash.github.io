import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared-module/shared.module';
import { LandingPageComponent } from './landing-page/home/landing-page.component';
import { GearPageModule } from './gear-page/gear-page.module';
import { AppComponent } from './app.component';
import { LandingPageModule } from './landing-page/landing-page.module';

import { ZorroAntdModule } from './app-zorro.module';
import { KatexModule } from 'ng-katex';

import { registerLocaleData } from '@angular/common';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';

registerLocaleData(en);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot([]),
        AppRoutingModule,

        SharedModule,
        GearPageModule,
        LandingPageModule,

        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,

        KatexModule,
        ZorroAntdModule,
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }],
    bootstrap: [AppComponent],
})
export class AppModule {}
