import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CalculationsResultsData } from 'src/app/models/gear-parameters.model';

@Component({
    selector: 'app-gear-table',
    templateUrl: './gear-table.component.html',
    styleUrls: ['./gear-table.component.scss'],
})
export class GearTableComponent implements OnInit, OnChanges {
    constructor() {}

    @Input()
    resultData?: CalculationsResultsData;

    hasReceivedData = false;

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.hasReceivedData = this.resultData !== undefined;
    }
}
