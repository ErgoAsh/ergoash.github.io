export interface TableDataRow {
    key: string;
    name: string;
    formula?: string;
    valueLeft?: number;
    valueRight?: number;

    level: number;
    isExpanded: boolean;
    useColumnSpan?: boolean;

    children?: TableDataRow[];
    parent?: TableDataRow;
}
