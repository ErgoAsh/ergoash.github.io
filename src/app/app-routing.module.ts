import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GearPageModule } from './gear-page/gear-page.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { SchedulePageModule } from './schedule-page/schedule-page.module';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => LandingPageModule,
    },
    {
        path: 'gear',
        loadChildren: () => GearPageModule,
    },
    {
        path: 'schedule',
        loadChildren: () => SchedulePageModule
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
