/* eslint-disable no-useless-concat */
import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, isBusinessDay, PriceScaleMode, TickMarkType, removeSeries } from 'lightweight-charts';
import { store} from '../../../../redux/store'
import { fetchTradehist } from '../../../../util/network'
import "./Chart.css";
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
    const chart2 = useRef(null);
    const chart3 = useRef(null);
    const chartRef = useRef(null);
    const candleSeries = useRef(null);
    const volumeSeries = useRef(null);
    const areaSeries = useRef(null);
    const lineSeries = useRef(null);
    const resizeObserver = useRef();
    const [marker, setMarkers] = useState([])
    const [chartCreated, setChartCreated] = useState(false)

    // Chart setting and layout...
    const chart_layout = () => {
        chart.current = createChart(chartRef.current, {
            width: chartRef.current.clientWidth,
            height: chartRef.current.clientHeight * 0.5,
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
        chart2.current = createChart(chartRef.current, {
            width: chartRef.current.clientWidth,
            height: chartRef.current.clientHeight * 0.25,
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
                mode: CrosshairMode.Magnet,  // 跟線走
            },
        });
        chart3.current = createChart(chartRef.current, {
            width: chartRef.current.clientWidth,
            height: chartRef.current.clientHeight * 0.25,
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
                mode: CrosshairMode.Magnet,  // 跟線走
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
        volumeSeries.current = chart.current.addHistogramSeries({
            color: '#182233',
            lineWidth: 2,
            priceFormat: {
                type: 'volume',
            },
            overlay: true,
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });
        areaSeries.current = chart2.current.addAreaSeries({
            topColor: 'rgba(38,198,218, 0.80)',
            bottomColor: 'rgba(38,198,218, 0.04)',
            lineColor: 'rgba(38,198,218, 0.95)',
            crosshairMarkerBackgroundColor: '#1176f3',
            lineWidth: 2
        });
        lineSeries.current = chart3.current.addLineSeries({
            color: '#f48fb1',
            crosshairMarkerBackgroundColor: '#dd4556',
            lineWidth: 2
        });
        chartbox();
        chartVisibleRange();
        chart.current.timeScale().fitContent()
        setChartCreated([chart.current, chart2.current, chart3.current])
    };

    // Visible range of three charts are connected by each other
    const chartVisibleRange = () => {
        chart.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
            chart2.current.timeScale().setVisibleLogicalRange(range)
            chart3.current.timeScale().setVisibleLogicalRange(range)
        })
        chart2.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
            chart.current.timeScale().setVisibleLogicalRange(range)
            chart3.current.timeScale().setVisibleLogicalRange(range)
        })
        chart3.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
            chart.current.timeScale().setVisibleLogicalRange(range)
            chart2.current.timeScale().setVisibleLogicalRange(range)
        })
    }

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

    // Initial layout : if no chart created yet, create one with options and add to DOM manually
    useEffect(() => {
        if (!chartCreated)
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
    }, []);

    // clear data when time interval changed
    useEffect(() => {
        const reCreateChart = () => {
            chart.current.remove();
            chart2.current.remove();
            chart3.current.remove();
            candleSeries.current = null;
            volumeSeries.current = null;
            areaSeries.current = null;
            lineSeries.current = null;
            chart_layout();
        }
        reCreateChart();
    }, [store.getState().timeInterval])

    // Recreate the chart if the product is changed
    useEffect(() => {
        const reCreateChart = () => {
            chart.current.remove();
            chart2.current.remove();
            chart3.current.remove();
            chart_layout() // create chart again
        };
        reCreateChart();
    }, [store.getState().product]);

    // Renew data (only when changing product or time interval)
    useEffect(() => {
        if (!props.chartData || props.chartData.length !== 3) return;
        if (candleSeries.current) {
            candleSeries.current.setData(props.chartData[0]);
            volumeSeries.current.setData(props.chartData[1]);
        }
        if (areaSeries.current) areaSeries.current.setData(props.chartData[1]);
        if (lineSeries.current) lineSeries.current.setData(props.chartData[2]);
    }, [props.chartData]);

    // update data
    useEffect(()=>{
        if (!props.updateData || props.updateData.length !==3) return;
        try{
            candleSeries.current.update(props.updateData[0][0]);
            volumeSeries.current.update(props.updateData[1][0]);
            areaSeries.current.update(props.updateData[1][0]);
            lineSeries.current.update(props.updateData[2][0]);
        }
        catch (exception) { console.warn(exception)}
    },[props.updateData])

    // Mark
    useEffect(() =>{
        setMarkers([])
        fetchTradehist().then(response => {
            if (!response) return;
            response.map(value => {
                if (value){
                    let position = (value.isBuyer === 'Buy') ? "belowBar" :"aboveBar";
                    let color = (value.isBuyer === 'Buy') ? "#e91e63" : "#89c12d";
                    let shape = (value.isBuyer === 'Buy') ? "arrowUp" :"arrowDown";
                    let txt = (value.isBuyer === 'Buy') ? "買點" : "賣點";
                    let interval = store.getState().timeInterval;
                    let time = new Date(value.time).getTime() / 1000;
                    switch(interval){
                        case '1m':
                            time = Math.floor(time / 60) * 60;
                            break;
                        case '15m':
                            time = Math.floor(time / 60 / 15) * 60 * 15;
                            break;
                        case '1h':
                            time = Math.floor(time / 60 / 60) * 60 * 60;
                            break;
                        case '8h':
                            time = Math.floor(time / 60 / 60 / 8) * 60 * 60 * 8;
                            break;
                        case '1d':
                            time = Math.floor(time / 60 / 60 / 24) * 60 * 60 * 24;
                            break;
                        case '1M':
                            time = Math.floor(time / 60 / 60 / 24 / 30) * 60 * 60 * 24 * 30;
                            break;
                        default:
                            break;
                    }
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
    }, [store.getState().displayExchange, store.getState().timeInterval])
    
    // Resize chart on container resizes.
    useEffect(() => {
        resizeObserver.current = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            chart.current.applyOptions({ width, height: (height * 0.5)});
            chart2.current.applyOptions({ width, height: (height * 0.25)});
            chart3.current.applyOptions({ width, height: (height * 0.25)});
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