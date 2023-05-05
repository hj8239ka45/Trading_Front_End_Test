import React, { useEffect, useState } from 'react';
import "./page_User.css";
//https://ithelp.ithome.com.tw/m/articles/10243823
import { store } from '../../../redux/store';
import { LoginAction } from "../../../redux/action/action"
// user page (Login)
const User2 = (props) => {
    const [api, setApi] = useState({ apikey: "", secretkey: "" });// state of binance api

    const onhandle_key = (e) => {   // input handle event
        const { name, value } = e.target
        setApi({ ...api, [name]: value })
    }
    const handleClick = (e) => {    // 
        e.preventDefault();
        store.dispatch(LoginAction({ api }));
    }

    return (
        <div className='block'>
            <form className='user-form' onSubmit={handleClick}>
                <div className="form-inner">
                    <h2>User Login</h2>
                    {
                        (props.error !== "") ? (
                            <div className='error'>{props.error}</div>)
                            : ""
                    }
                    <div className='form-group'>
                        <label htmlFor='api-key'>api-key：</label>
                        <input className='user-input' type="text" name="apikey" placeholder='api-key' required onChange={onhandle_key} className="value"></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='secret-key'>secret-key：</label>
                        <input className='user-input' type="text" name="secretkey" placeholder='secret-key' required onChange={onhandle_key} className="value"></input>
                    </div>
                    <button className='user-button' onSubmit={handleClick}> LOGIN </button>
                </div>
            </form>
        </div>
    );
}
export default User2;