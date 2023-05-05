import React, { createRef} from 'react';

const TimeSelector = () => {
    const dateRef = createRef()
    const numRef = createRef()
    const clickede = (event) =>{
        console.log(dateRef.current.value)
        console.log(numRef.current.value)
    }
    return (
        <div className='timeSelector'>
            <div className='timeSelect-changeinedex'>
                <button>更改參數數值</button>
            </div>
            <label>開始日期</label>
            <div className='timeSelect-selector'>
                <input type="date" defaultValue="2019-01-01" ref={dateRef}/>
            </div>
            <label>執行天數</label>
            <div className='timeSelect-num'>
                <input type="text" size="4" maxlength="4" defaultValue="20" ref={numRef}/> 天
            </div>
            <div className='timeSelect-send'>
                <button onClick={clickede}>開始回測</button>
            </div>
        </div>
    );
}
export default TimeSelector;