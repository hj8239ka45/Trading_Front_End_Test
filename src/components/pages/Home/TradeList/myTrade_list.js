import { useTablePipeline, BaseTable, features } from "ali-react-table";


function MytradeTable(props) {
  const columns = [
          { name: '交易', code: 'id',width: 35},
          { name: '種類', code: 'symbol',width: 30},
          { name: '買方', code: 'isBuyer',width: 30, features: { sortable: true }},
          { name: '成交量', code: 'qty',width: 30, features: { sortable: true }},
          { name: '成交價', code: 'price',width: 30, features: { sortable: true }},
          { name: '成交額', code: 'quoteQty',width: 30, features: { sortable: true }},
          { name: '日期', code: 'time',width: 50, features: { sortable: true }},
          { name: '獲利', code: 'profit',width: 30},
          { name: '累計獲利', code: 'total_profit',width: 30},
          { name: '最大交易獲利', code: 'max_profit',width: 30},
          { name: '最大交易虧損', code: 'max_loss',width: 30},
          
          
    ]
  // ali-react-table setting
  const pipeline = useTablePipeline();
  pipeline.input({ dataSource: props.dataSource, columns });
  pipeline.use(
    features.sort({
        mode: 'single',
        defaultSorts: [{ code: 'time', order: 'desc' }],
        highlightColumnWhenActive: true,
      })
  )
  pipeline.primaryKey('id');
  columns.lock = true;

    return (
        <div>
            <BaseTable
                className={"BaseTable"}
                useOuterBorder
                useVirtual={true}
                emptyContent
                {...pipeline.getProps()}
            />
        </div>
    );
}

export default MytradeTable;