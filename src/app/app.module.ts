import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { StoreModule } from '@ngrx/store';
import * as fromMainStore from './reducers';
import * as fromPageContent from './reducers/page-content/page-content.reducer';
import { CarouselItemComponent } from './carousel-item/carousel-item.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselPageComponent } from './carousel-page/carousel-page.component';


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
	ScrollToModule.forRoot()
    //StoreModule.forFeature(fromPageContent.pageContentsFeatureKey, fromPageContent.reducer),
    //StoreModule.forFeature(fromMainStore.mainStoreFeatureKey, fromMainStore.reducers, { metaReducers: fromMainStore.metaReducers })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
