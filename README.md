# Trading_Front_End_Test
##  1.App架構建立
###    (1.1) 使用Hook建立App function state，其中包含:幾分K線、顯示指標圖形
###    (1.2) 使用react-router-dom建立起頁面跳轉系統
###    (1.3) 使用react-bootstrap快速建立header導覽頭
##  2.page/home
###      2.1 FetchAPI 抓取幣安API，並進行資料更新
        (2.1.1) 使用fetch方式將binance api取出並使用map進行重新整理封裝成dictionary，根據useEffect狀態變化以及setIntervalTime之定時呼叫，對fetchAPI進行資料更新
###      2.2 chart    將抓到的資料進行繪圖
        (2.2.1) 使用light-weight建立K線圖功能
        (2.2.2) 使用Hook建立useRef進行圖形乘載，由於home處會建立三張不同功能線圖，在初始建立圖形(chart_layout)會由home傳入props.chartType進行不同設定。
        (2.2.3) 在timescale的部分建立tickMarkFormatter，使圖形時間可自定義顯示時間區間，如使用分鐘線則顯示幾小時幾分鐘，使用日線則顯示幾月幾日；在localization設定時差
        (2.2.4) 使用useEffect進行initial layout以及離開釋放功能，離開時使用cleanup
        (2.2.5) 由home傳入props.chartData，建立useEffect進行圖形資料更新。
        (2.2.6) 於第一張圖左上顯示游標指向之資料即時顯示(chartbox):
                1. 使用document.createElement('div')建立圖區進行顯示資料
                2. 使用chart.current.subscribeCrosshairMove與游標在圖形上的位置進行連動，紀錄位置參數
###      2.3 TradesHistoryList    顯示進行歷史成交價
        (2.3.1) 將FetchAPI得到資料透過dataSource傳入
        (2.3.2) 使用ali開發之表格套件，並使用pipeline.input規劃傳入之dataSource(可自動刷新)
                使用pipeline.use規劃資料排列順序
###      2.4 ProductList          顯示產品即時價格
        (2.4.1) 將FetchAPI得到資料透過dataSource傳入
        (2.4.2) 資料先經由Set格式之symbols_allowed並使用filter進行篩選，挑選出常使用之虛擬貨幣產品進行顯示
        (2.4.3) 使用ali開發之表格套件，並使用pipeline.input規劃傳入之dataSource(可自動刷新)
                使用pipeline.use規劃資料排列順序
        (2.4.4) 建立產品點選事件，使目前點選的產品被額外框線強調，並回傳給home目前參考產品名稱
###      2.5 TradeList

###      2.6 SoreBox

###      2.7 TradeBox
##  3.page/user

##  4.page/backtesting
##  5.page/index
##  6.redux  
![image](https://user-images.githubusercontent.com/39979565/236742734-2578d769-a004-450c-8360-58e888ca93a8.png)
###    (6.1)用途
        用於建立最外層之index.js內部所有狀態溝通連結
###    (6.2)constant
        此組件用於定義action對象中type類型之常數名稱
        避免action以及reducer溝通單字寫錯、人為疏失問題
###    (6.3)store
        建立共通之state資料建立
###    (6.4)reducer
        依據action訊息，處理store內部紀錄資料並更新store
        1.創建一個state套件服務的reducer，其本質作為一個函數
        2.reducer函數會接兩個參數
            2.1 之前的狀態(preState)
            2.2 動作對象(action)
        3.defalut用於初始化情況
###    (6.5)action
        傳遞給reducer觸發函數以及訊息，一般可分為以下兩類：
            1. Object{} 同步(即時傳輸)類型action
            2. function 異步(延遲傳輸)類型action
                (1.)明確：延遲的動作不想交給react組件本身，而是想要給action進行
                (2.)具體編碼
                    一般用dispatch只接收Object類型回傳 若將異步function傳入會導致型別錯誤
                    因此需要中介質redux-thunk進行溝同 並在
                    1.store引入redux-thunk
                    2.applyMiddleware
                    以進行支持函數傳入
                    最後在createStore中引入applyMiddleware(thunk)

                    export const LogoutAsycAction = (data,time) =>{
                        return (dispatch) => {
                            setTimeout(() = >{
                                dispatch(LogoutAction(data))
                            },time)
                        }
                    }
                (3.)異步action一般會調用同步action進行使用，且異步action非為必需品，亦可在react內部建立異步傳輸
###    (6.6)react-redux
        react與redux為不同官方推出套件
        react-redux為FB官方推出，可以使原先redux功能更為方面進行運作
        使內部component可藉由container進行與redux進行連結(目前component與container功能並未獨立)
###    (6.7)redux-persist
        使用persistStore保留store資料不被F5或頁面跳轉刷新
###    (6.8)ref
        https://www.youtube.com/watch?v=ueTDYjtvSBI&list=PLmOn9nNkQxJFJXLvkNsGsoCUxJLqyLGxu&index=103
##  7.目前成果  
![image](https://user-images.githubusercontent.com/39979565/236743237-4cd0b5d6-badb-4570-9bc0-205e097c2cf5.png)
![image](https://user-images.githubusercontent.com/39979565/236743348-e68c6422-aa10-43f0-aab8-81b15a84b53c.png)

