import './ScoreBox.css';
import Score from './score';
import Userinfo from './userinfo';
const buyintensity=[2];
const sellintensity=[0];
const ScoreBox=()=> {
  return (
    <div className='score'>
        <Userinfo/>
        <Score buyIntensity = {buyintensity} sellIntensity = {sellintensity}/>
    </div>
  );
}

export default ScoreBox;
