//https://api.binance.com/api/v3/ticker/price
import React, { useEffect, useState} from "react";
import { useTablePipeline, features, BaseTable } from 'ali-react-table'
import { store } from '../../../../redux/store'
import { ChangeProductAction } from '../../../../redux/action/action'

//import Home from "./page_Home"
//import { Checkbox } from '@alifd/next'

export default function ProductList(props) {
  // to set table-click event and get the data
  const [lastClickRowIndex, setLastClickRowIndex] = useState();// initial checked item.
  // setLastClickRowIndex(props.dataSource.findIndex(element => element.symbol === store.getState().product))
  // products column
  const columns = [
    { code: 'symbol', name: '產品', width: 60, features: { sortable: true }},
    { code: 'price', name: '價格', width: 40, align: 'right', features: { sortable: true }},
  ];
  useEffect(()=>{
    setLastClickRowIndex(pipeline.getProps().dataSource.findIndex(element => element.symbol === store.getState().product))
  }, [props.dataSource])
  // ali-react-table setting
  const pipeline = useTablePipeline();

  pipeline.input({ dataSource: props.dataSource, columns });
  
  pipeline.use(
    features.sort({
      mode: 'single',
      defaultSorts: [{ code: 'price', order: 'desc' }],
      highlightColumnWhenActive: true,
    }),
  )
  pipeline.primaryKey('id');
  columns.lock = true;

  // selected table style
  const selectedRowStyle = {
    outlineOffset: -2,
    outline: '2px solid #333',
    background: '#fff',
    color: 'red',
  };
  // usselected table style
  const unselectedRowStyle = {};
  
  // footer style
  const footerStyle = {
    position: 'sticky',
    bottom: 0,
    height: 48,
    border: '1px solid #ccc',
    zIndex: 30,
    background: 'white',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div>
        <BaseTable
          stickyBottom={48}
          useVirtual={true}
          emptyContent
          {...pipeline.getProps()}
          getRowProps={(recorddata, rowIndex) => {
            return {
              style: rowIndex === lastClickRowIndex ? selectedRowStyle: unselectedRowStyle,
              onClick() {
                  setLastClickRowIndex(rowIndex);
                  store.dispatch(ChangeProductAction(recorddata.symbol));
              },
            }
          }}
        />
        <div style={footerStyle}>
            表格底部操控欄，這裡可以放置分頁控制元件
        </div>
    </div>
  );
}
