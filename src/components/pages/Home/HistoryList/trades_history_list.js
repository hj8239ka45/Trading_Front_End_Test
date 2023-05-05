//https://api.binance.com/api/v3/ticker/price
import React from "react";
import { useTablePipeline, features, BaseTable } from 'ali-react-table'
// 成交價量

export default function TradesHistoryList(props) {
    // products column
    const columns = [
        { code: 'time', name: '時間', width: 30, features: { sortable: true }},
        { code: 'price', name: '價格', width: 35, align: 'right'},
        { code: 'qty', name: '數量', width: 35, align: 'right'}
    ];
    // ali-react-table setting
    const pipeline = useTablePipeline();
    pipeline.input({ dataSource: props.dataSource, columns });
    pipeline.use(
        features.sort({
            mode: 'single',
            defaultSorts: [{ code: 'time', order: 'desc' }],
            highlightColumnWhenActive: true,
        }),
    )
    pipeline.primaryKey('id');
    columns.lock = true;

    return (
        <div>
            <BaseTable
                useVirtual={true}
                style={{ overflow: 'auto' }}
                emptyContent
                {...pipeline.getProps()}
            />
        </div>
    );
}
