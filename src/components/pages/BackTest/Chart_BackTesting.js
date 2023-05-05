/* eslint-disable no-useless-concat */
import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, isBusinessDay, PriceScaleMode, TickMarkType,  } from 'lightweight-charts';
import { store} from '../../../redux/store'
import { fetchTradehist } from '../../../util/network'
// ref https://codesandbox.io/s/winter-hill-q5wz7 beautiful interface
// ref https://codesandbox.io/s/x2jq3znlpw real-time generized random data(use update)
// ref  https://jsfiddle.net/b5v8L9et/
// ref timezone https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
// 

//real data import ref https://codesandbox.io/s/flamboyant-northcutt-mstmb?file=/src/App.js:127-1736
// input props:
//       width:     the width of the chart
//       height:    the height of the chart
//       chartData: current chart data
const Chart = (props) => {
    // reference for DOM element to create with chart
    const chart = useRef(null);
    const chartRef = useRef(null);
    const candleSeries = useRef(null);
    const resizeObserver = useRef();
    const [marker, setMarkers] = useState([])

    const [chartCreated, setChartCreated] = useState(false)

    /*
    const formattedData = props.chartData?.map(entry => {
        return {
            time: parseFloat(entry.timestamp),
            open: parseFloat(entry.open),
            low: parseFloat(entry.open),
            close: parseFloat(entry.close),
            high: parseFloat(entry.close)
        }
    })*/
    // reset the chart if data renew
    /*
    useEffect(() => {
        if (data !== dataPrev && chartCreated) {
            // remove the tooltip element
            let tooltip = document.getElementById('tooltip-id')
            let node = document.getElementById('test-id')
            node.removeChild(tooltip)
            chartCreated.resize(0, 0)
            setChartCreated()
        }
    }, [chartCreated, data, dataPrev])*/

    // Initial layout : if no chart created yet, create one with options and add to DOM manually
    useEffect(() => {
        if(!chartCreated)
            chart_layout();
        return function cleanup() {
            //chart.current.remove();
            //chart.current = null;
            /*
            candleSeries = null;
            volumeSeries = null;
            areaSeries = null;
            */
        };
    }, [props.width, props.height]);


    // Chart setting and layout...
    const chart_layout = () => {
        chart.current = createChart(chartRef.current, {
            width: chartRef.current.clientWidth,
            height: chartRef.current.clientHeight,
            rightPriceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                mode: PriceScaleMode.Logarithmic,
            },
            layout: {
                backgroundColor: '#253248',
                textColor: 'rgba(255, 255, 255, 0.9)',
            },
            timeScale: {
                borderColor: '#485c7b',
                timeVisible: true,
                tickMarkFormatter: tickMarkFormatter,
            },
            localization: {
                timeFormatter: timeFormatter,
            },
            grid: {
                vertLines: {
                    color: '#334158',
                },
                horzLines: {
                    color: '#334158',
                },
            },
            crosshair: {
                mode: CrosshairMode.Normal,// 跟游標走
            },
        });
        candleSeries.current = chart.current.addCandlestickSeries({
            upColor: '#4bffb5',
            downColor: '#ff4976',
            borderDownColor: '#ff4976',
            borderUpColor: '#4bffb5',
            wickDownColor: '#838ca1',
            wickUpColor: '#838ca1',
        });
        chartbox();
        chart.current.timeScale().fitContent()
        setChartCreated([chart.current])
    };

    // Chart information display
    const chartbox = () => {
        // cursored candle data display
        var toolTip = document.createElement('div');
        toolTip.setAttribute('id', 'tooltip-id');
        toolTip.className = 'floating-tooltip-2';

        // distinguish old child("tooltip-id") if it contain in the parent(document)
        // if true, replace the old child by new one
        // if false, append the new one
        if (chartRef.current.contains(document.getElementById("tooltip-id"))){
            chartRef.current.replaceChild(toolTip, document.getElementById("tooltip-id"));
        }
        else
            chartRef.current.appendChild(toolTip);
        toolTip.style.display = 'block';
        toolTip.style.left =  + 'px';
        toolTip.style.top = 10 + 'px';
        toolTip.style.backgroundColor = 'transparent';
        // get the title of the chart
        function setLastBarText() {
            toolTip.innerHTML = `<p>${store.getState().product}</p>`;
        }
        setLastBarText()
        // renew the text when mouse moving
        chart.current.subscribeCrosshairMove(function (param) {
            if (
                param === undefined ||
                param.time === undefined ||
                param.point.x < 0 ||
                param.point.x > props.width ||
                param.point.y < 0 ||
                param.point.y > props.height
            ) {
                setLastBarText()
            }
            else{
                // build time label and price label
                var dateStr = isBusinessDay(param.time)
                    ? new Date(param.time * 1000).toLocaleTimeString()
                    : new Date(param.time * 1000).toLocaleDateString() + new Date(param.time * 1000).toLocaleTimeString();
                var price = param.seriesPrices.get(candleSeries.current) ;
                // if it works sucessfully, set the information in the block
                // otherwise, set the error text.
                try{
                    var str = "open:" + price.open + "&nbsp;&nbsp;high:" + price.high + "&nbsp;&nbsp;low:" + price.low + "&nbsp;&nbsp;close:" + price.close;
                    toolTip.innerHTML = `<p>${store.getState().product} &nbsp;&nbsp;&nbsp;` + dateStr + '</p>' +
                        '<p>' + str + '</p>';
                }
                catch{ 
                    toolTip.innerHTML = `<p>Can't get data</p>`
                }
            }
        });
    }

    // Change the TimeZone of timeFormat and tickMarkFormat to local TimeZone
    var tickMarkFormatter = (timestamp, tickMarkType, locale) => {
        const date = new Date(timestamp * 1000);
        // eslint-disable-next-line default-case
        switch (tickMarkType) {
            case TickMarkType.Year:
                return date.getFullYear();
            case TickMarkType.Month:
                const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
                return monthFormatter.format(date);
            case TickMarkType.DayOfMonth:
                return date.getDate();
            case TickMarkType.Time:
                const timeFormatter = new Intl.DateTimeFormat(locale, { hour12: false, hour: "numeric", minute: "numeric" });
                return timeFormatter.format(date);
            case TickMarkType.TimeWithSeconds:
                const timeWithSecondsFormatter = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "numeric", second: "numeric" });
                return timeWithSecondsFormatter.format(date);
        }
        throw new Error('Unhandled tick mark type ' + tickMarkType);
    }
    var timeFormatter = (timestamp) => {
        const date = new Date(timestamp * 1000).toLocaleDateString() + "  " + new Date(timestamp * 1000).toLocaleTimeString();
        return date;
    }


    // Recreate the chart if the product is changed
    useEffect(() => {
        const reCreateChart = () => {
            chart.current.remove();
            chart_layout() // create chart again
        };
        reCreateChart();
    }, [store.getState().product]);

    // Renew data of the chart
    useEffect(() => {
        if (!props.chartData) return;
        if (candleSeries.current) {
            candleSeries.current.setData(props.chartData);
        }
    }, [props.chartData]);
    
    // Mark
    /*
    useEffect(() =>{
        setMarkers([])
        fetchTradehist().then(response => {
            response.map((value) => {
                if (value){
                    let position = (value.isBuyer === 'Buy') ? "belowBar" :"aboveBar";
                    let color = (value.isBuyer === 'Buy') ? "#e91e63" : "#89c12d";
                    let shape = (value.isBuyer === 'Buy') ? "arrowUp" :"arrowDown";
                    let txt = (value.isBuyer === 'Buy') ? "買點" : "賣點";
                    let interval = store.getState().timeInterval;
                    let time = new Date(value.time).getTime() / 1000;
                    if (interval === '1h' || interval === '8h')
                        time = Math.floor(time / 60 / 60 ) * 60 * 60;
                    if (interval === '1d' || interval === '1w' ) 
                        time = Math.floor(time / 60 / 60 / 24) * 60 * 60 * 24;
                    if (interval === '1M')
                        time = Math.floor(time / 60 / 60 / 24 / 30) * 60 * 60 * 24 * 30;
                    if (value.symbol === store.getState().product)
                        setMarkers(prevState => [...prevState, {
                            time: time,
                            position: position,
                            color: color,
                            shape: shape,
                            text: txt,
                            size: 1
                    }]);
                }
            })
        })
    },[store.getState().product, store.getState().timeInterval])
    
    useEffect(() => {
        if (store.getState().displayExchange)
            candleSeries.current.setMarkers(marker)
        else
            candleSeries.current.setMarkers([])
    }, [store.getState().displayExchange, store.getState().timeInterval])*/
    
    // Resize chart on container resizes.
    useEffect(() => {
        resizeObserver.current = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            chart.current.applyOptions({ width, height: (height)});
            setTimeout(() => {
                chart.current.timeScale().fitContent();
            }, 0);
        });

        resizeObserver.current.observe(chartRef.current);

        return () => resizeObserver.current.disconnect();
    }, []);

    // Return the chart in the end
    return (
        <div className="chart-container">
            <div ref={chartRef} className="chart_ref"/>
        </div>
    );
}
export default Chart;