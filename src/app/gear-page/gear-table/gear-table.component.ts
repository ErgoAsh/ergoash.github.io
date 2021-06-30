import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CalculationsResultsData } from 'src/app/models/gear-parameters.model';
import { TableDataRow } from 'src/app/models/gear-tables.model';
import { GearTableService } from 'src/app/services/gear-table/gear-table.service';

@Component({
    selector: 'app-gear-table',
    templateUrl: './gear-table.component.html',
    styleUrls: ['./gear-table.component.scss'],
})
export class GearTableComponent implements OnInit, OnChanges {
    constructor(private tableService: GearTableService) {}

    @Input()
    resultData?: CalculationsResultsData;

    tableData: TableDataRow[] = [];
    tableMap: { [key: string]: TableDataRow[] } = {};

    hasReceivedData = false;
    tabContentHeight = 1;

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.hasReceivedData = this.resultData !== undefined;

        if (this.resultData !== undefined) {
            this.tableData = this.tableService.getTableData(this.resultData);

            this.tableData.forEach((item) => {
                this.tableMap[item.key] =
                    this.tableService.convertTreeToList(item);
            });
        }

        const cnt = document.querySelector('.ant-tabs-content') as HTMLElement;
        this.tabContentHeight = cnt.scrollHeight;
        console.log(this.tabContentHeight);
    }

    collapse(array: TableDataRow[], data: TableDataRow, $event: boolean): void {
        this.tableService.collapse(array, data, $event);
    }
}
