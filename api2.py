import time

import decimal

#from ttest import tan
from binance.client import Client
import numpy as np
import pandas as pd
import win32api
from flask import Flask, request, jsonify
import json
import time

app = Flask(__name__)
# =============================================================================
# =============================================================================
api_key = ''
api_secret = ''

client = Client(api_key, api_secret)


@app.route('/data', methods=['GET', 'POST'])
def get_data():
    if request.method == 'POST':
        b = int(request.get_json())
        a = 30 * b
        print(a)
    return {'data': b,
            'btc': a}


@app.route('/call', methods=['GET', 'POST'])
def call():
    if request.method == 'POST':
        BuyPoint = int(request.values['BuyPoint'])
        print(BuyPoint)
        SellPoint = int(request.values['SellPoint'])
        print(SellPoint)
        StartTime = request.values['StartTime']
        print(StartTime)
        EndTime = request.values['EndTime']
        print(EndTime)
        klines1 = client.get_historical_klines("BTCUSDT", Client.KLINE_INTERVAL_1MINUTE, str(StartTime), str(EndTime))
        whole_df1 = pd.DataFrame(klines1)
        time.sleep(1.5)
        whole_df1.to_csv('binance_BTCUSDT_data_1minute.csv', encoding='utf-8')

        tangu = tan()
        k = np.array([[10, 1000],
                      [10, 1000],
                      [10, 1000],
                      [10, 1000],
                      [10, 1000],
                      [10, 1000],
                      [10, 1000]], dtype=float)
        maxpar = tangu.maxpar(k, BuyPoint, SellPoint, str(StartTime), str(EndTime))
        print(maxpar)
        maxval = tangu.maxval()
        print(maxval)
        print("finish ")
        return {"total value": maxval,
                "rsi": maxpar[0],
                "mfi": maxpar[1],
                "cci": maxpar[2],
                "sar": maxpar[3],
                "dmi": maxpar[4],
                "kdj": maxpar[5],
                "macd": maxpar[6]}


@app.route('/array', methods=['GET', 'POST'])
def array():
    if request.method == 'POST':
        USDT = client.get_asset_balance('USDT')
        BTC = client.get_asset_balance('BTC')
        return {"USDT": USDT['free'], "BTC":BTC['free']}


@app.route('/buy', methods=['GET', 'POST'])
def buy():
    if request.method == 'POST':
        buy_point = int(request.get_json())
        price = client.get_symbol_ticker(symbol="BTCUSDT")
        buy_price = decimal.Decimal(price['price'])
        buy_quantity = buy_point / buy_price
        buy_quantity = round(buy_quantity, 5)
        print(buy_quantity)
        client.order_market_buy(symbol="BTCUSDT", quantity=str(buy_quantity))
        print("ok")
        return None

@app.route('/sell', methods=['GET', 'POST'])
def sell():
    if request.method == 'POST':
        buy_point = int(request.get_json())
        price = client.get_symbol_ticker(symbol="BTCUSDT")
        buy_price = decimal.Decimal(price['price'])
        buy_quantity = buy_point / buy_price
        buy_quantity = round(buy_quantity, 5)
        print(buy_quantity)
        client.order_market_sell(symbol="BTCUSDT", quantity=str(buy_quantity))
        print("ok")
        return None
    
@app.route('/buylim', methods=['GET', 'POST'])
def buylim():
    if request.method == 'POST':
        buy_point = request.get_json()
        price = buy_point[1]
        buy_quantity = buy_point[0]/ price
        buy_quantity = round(buy_quantity, 5) 
        client.order_limit_buy(symbol="BTCUSDT", quantity=str(buy_quantity), price=str(price))
        print("ok")
        return None
    
@app.route('/selllim', methods=['GET', 'POST'])
def selllim():
    if request.method == 'POST':
        buy_point = request.get_json()
        price = buy_point[1]
        buy_quantity = buy_point[0]/ price
        buy_quantity = round(buy_quantity, 5) 
        client.order_limit_sell(symbol="BTCUSDT", quantity=str(buy_quantity), price=str(price))
        print("ok")
        return None

@app.route('/tradehist', methods=['GET', 'POST'])
def tradehist():
    if request.method == 'POST':
        my_trade = client.get_my_trades(symbol="BTCUSDT")
        return json.dumps(my_trade)

if __name__ == "__main__":
    app.run()
    gt = client.get_server_time()
    tt = time.gmtime(int((gt["serverTime"]) / 1000))
    win32api.SetSystemTime(tt[0], tt[1], 0, tt[2], tt[3], tt[4], tt[5], 0)
    
    