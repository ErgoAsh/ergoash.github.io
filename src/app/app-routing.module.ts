import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GearPageModule } from './gear-page/gear-page.module';
import { LandingPageModule } from './landing-page/landing-page.module';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => LandingPageModule,
    },
    {
        path: 'gear',
        loadChildren: () => GearPageModule,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
