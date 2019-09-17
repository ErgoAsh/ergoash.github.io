import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { StoreModule } from '@ngrx/store';

import { CarouselItemComponent } from './carousel-item/carousel-item.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselPageComponent } from './carousel-page/carousel-page.component';
import { reducers, initialState } from './app.state';

@NgModule({
  declarations: [
	AppComponent,
	CarouselItemComponent,
	CarouselPageComponent
  ],
  imports: [
	BrowserModule,
	ClarityModule,
	BrowserAnimationsModule,
	ScrollToModule.forRoot(),
	StoreModule.forRoot(reducers, { initialState })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
