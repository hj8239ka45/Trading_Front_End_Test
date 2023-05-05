/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react';
import "./page_Home.css";
import Chart from './Chart/Chart';
import ProductList from "./ProductList/product_list";
import TradesHistoryList from "./HistoryList/trades_history_list";
import TradeList from "./TradeList/TradeList"
import ScoreBox from "./ScoreBox/ScoreBox"
import TradeBox from "./TradeBox/TradeBox"
import { fetchData, fetchPrices, fetchTrades } from "../../../util/network"
import { store } from '../../../redux/store';

// 更新研究 AJAX、Long polling、Web Socket、Fetch

const Home = (props) => {
    const [product, setProduct] = useState('BTCUSDT'); //set init. product data
    const [intervaltime, setIntervalTime] = useState('1d'); //set init. product data
    const onChanged = () => {}
    const [productData, setProductData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [updateData, setUpdateData] = useState([]);
    const [tradesData, setTradesData] = useState([]);
    const symbols_allowed = new Set(["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "LINKUSDT", "ADAUSDT", "SANDUSDT", "NFTUSDT", "LUNAUSDT", "SHIBUSDT"]);

    // read location hash and set time interval.
    useEffect(() => {
        setProduct(store.getState().product)
    }, [store.getState().product]);

   // read location hash and set time interval.
    useEffect(() => {
        setIntervalTime(store.getState().timeInterval);
    }, [store.getState().timeInterval]);

    // initial data setting
    useEffect(()=>{
        refreshPriceData();// get data from network
    },[product, intervaltime])
    // refresh chart data per 500ms // change url when the product is changed
    useEffect(() => {
        updatePriceData();// get data from network
        const timer = setInterval(updatePriceData, 500);// time interval
        return () => clearInterval(timer);// clear
    }, [product, intervaltime]);

    // refresh product table data per 2000ms
    useEffect(() => {
        refreshProductData();
        const timer = setInterval(refreshProductData, 500);
        return () => clearInterval(timer);
    }, [product]);//需要寫入product 才能使refreshPriceData function 內的 product 被重新渲染

    // refresh trades history table data per 2000ms
    useEffect(() => {
        refreshTradesHistoryData();
        const timer = setInterval(refreshTradesHistoryData, 1000);
        return () => clearInterval(timer);
    }, [product]);

    // fetch data (for chart)
    const refreshPriceData = () => {
        const url = `https://api.binance.com/api/v3/klines?symbol=${product}&interval=${intervaltime}&limit=1000`;
        fetchData(url).then(response => {
            if (response) setPriceData(response);
        });
    }
    const updatePriceData = () => {
        const url = `https://api.binance.com/api/v3/klines?symbol=${product}&interval=${intervaltime}&limit=1`;
        fetchData(url).then(response => {
            if (response) setUpdateData(response);
        });
    }

    // fetch data (for product price table)
    const refreshProductData = () => {
        fetchPrices().then(response => {
            if (response) setProductData(response);
            //const found = priceData.find(element => element.symbol === product);
            //console.log(found);
        });
    }
    // fetch data (for recently trading price table)
    const refreshTradesHistoryData = () => {
        const url = `https://api.binance.com/api/v3/trades?symbol=${product}&limit=20`;
        fetchTrades(url).then(response => {
            if (response) setTradesData(response);
        });
    }
    /*
    <Chart width={chartDimension.width} height={chartDimension.height * 0.5} chartType='chart1' product_name={product} chartData={productData}></Chart>
    <Chart width={chartDimension.width} height={chartDimension.height * 0.25} chartType='chart2' chartData={productData}></Chart>
    <Chart width={chartDimension.width} height={chartDimension.height * 0.25} chartType='chart3' chartData={productData}></Chart>
    */
   
    return (
        <div className='home_block'>
            <div className="chart_block">
                <div className="chart" id="chart_b">
                    <Chart chartData={priceData} updateData={updateData}></Chart>
                </div>
                <div className="history_block" style={{ overflow: 'auto'}}>
                    <TradesHistoryList dataSource={tradesData}/>
                </div>
                <div className="product" style={{ overflow: 'auto' }}>
                    <ProductList dataSource={productData.filter(_ => symbols_allowed.has(_.symbol))} />
                </div>
            </div>
            <div className="api_block">
                <div className='block1' style={{ overflow: 'auto' }}><TradeList /></div>
                <div className='block2'><ScoreBox /></div>
                <div className='block3'><TradeBox /></div>
            </div>
        </div>
    );
}
export default Home;