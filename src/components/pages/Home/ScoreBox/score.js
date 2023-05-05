const Score=({buyIntensity, sellIntensity})=>{
    const style = [
        'reddot',
        'pinkdot',
        'graydot',
        'skydot',
        'bluedot'
    ];
    const intensityWord = [
        '極低',
        '低',
        '中',
        '高',
        '極高'
    ];
    return(
        <div>
            <div>買點強度</div>
            <div className={style[buyIntensity]}>{intensityWord[buyIntensity]}</div>
            <div>賣點強度</div>
            <div className={style[sellIntensity]}>{intensityWord[sellIntensity]}</div>
        </div> 
    );
}

export default Score;