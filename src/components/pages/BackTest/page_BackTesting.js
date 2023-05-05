import React, { useEffect, useState } from 'react';
import ProductList from "../Home/ProductList/product_list";
import { fetchPrices } from "../../../util/network"
import Chart from './Chart_BackTesting';
import { store } from '../../../redux/store'
import TestTab from './BackTestingTab'
import TimeSelector from './TimeSelector'
import './Chart_BackTesting.css'
const BackTest = () => {
    const [product, setProduct] = useState('BTCUSDT'); //set init. product data
    const [productData, setProductData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const symbols_allowed = new Set(["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "LINKUSDT", "ADAUSDT", "SANDUSDT", "NFTUSDT", "LUNAUSDT", "SHIBUSDT"]);

    // read location hash and set time interval.
    useEffect(() => {
        setProduct(store.getState().product)
    }, [store.getState().product]);

    // refresh product table data per 2000ms
    useEffect(() => {
        refreshProductData();
        const timer = setInterval(refreshProductData, 2000);
        return () => clearInterval(timer);
    }, [product]);//需要寫入product 才能使refreshPriceData function 內的 product 被重新渲染

    // fetch data (for product price table)
    const refreshProductData = () => {
        fetchPrices().then(response => {
            if (response) setProductData(response);
            //const found = priceData.find(element => element.symbol === product);
            //console.log(found);
        });
    }

    return (
        <div>
            <div className="chart_block">
                <div className="chart" id="chart_a">
                    <Chart chartData={priceData}></Chart>
                </div>
                <div className="product" style={{ overflow: 'auto' }}>
                    <ProductList dataSource={productData.filter(_ => symbols_allowed.has(_.symbol))} />
                </div>
            </div>
            <div className="chart_block">
                <div className="chart" id="chart_c">
                    <TestTab />
                </div>
                <div className="timeSelect">
                    <TimeSelector />
                </div>
            </div>
        </div>
    );
}
export default BackTest;