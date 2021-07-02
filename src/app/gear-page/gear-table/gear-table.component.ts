import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { CalculationsResultsData } from 'src/app/models/gear-parameters.model';
import { TableDataRow } from 'src/app/models/gear-tables.model';
import { GearTableService } from 'src/app/services/gear-table/gear-table.service';

@Component({
    selector: 'app-gear-table',
    templateUrl: './gear-table.component.html',
    styleUrls: ['./gear-table.component.scss'],
})
export class GearTableComponent implements OnInit, AfterViewInit, OnChanges {
    constructor(private tableService: GearTableService) {}

    @ViewChildren('firstColumn')
    firstColumn!: QueryList<HTMLTableColElement>;

    @Input()
    resultData?: CalculationsResultsData;

    tableData: TableDataRow[] = [];
    tableMap: { [key: string]: TableDataRow[] } = {};

    hasReceivedData = false;
    tabContentHeight = 1;

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        const scr = document.querySelector('.ant-table-body') as HTMLElement;
        if (scr !== null) {
            scr.style.height = (this.tabContentHeight - 55).toString() + 'px';
        }

        this.firstColumn.changes.subscribe((observer) => {
            const list = observer as QueryList<HTMLTableColElement>;
            list.forEach((col) => {
                if (
                    col.attributes.getNamedItem('ng-reflect-nz-indent-size')
                        ?.value === '0'
                ) {
                    col.style.columnSpan = '4';
                }
            });
        });
    }

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
    }

    collapse(array: TableDataRow[], data: TableDataRow, $event: boolean): void {
        this.tableService.collapse(array, data, $event);
    }

    toggleExpand(
        array: TableDataRow[],
        data: TableDataRow,
        isExpanded: boolean
    ): void {
        if (!isExpanded) {
            data.isExpanded = true;
            data.children?.forEach((item) => (item.isExpanded = true));
        } else {
            this.collapse(array, data, false);
            data.isExpanded = false;
        }
    }

    round(num?: number, roundDigit?: number): number | undefined {
        if (num === undefined || roundDigit === undefined) return undefined;

        if (roundDigit <= 0) {
            return num;
        }

        return (
            Math.round((num + Number.EPSILON) * Math.pow(10, roundDigit)) /
            Math.pow(10, roundDigit)
        );
    }
}
