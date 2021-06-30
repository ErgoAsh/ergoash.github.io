export interface TableDataRow {
    key: string;
    name: string;
    formula?: string;
    valueLeft?: number;
    valueRight?: number;
    useColumnSpan?: boolean;
    children?: TableDataRow[];
}
