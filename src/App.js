import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/pages/Home/page_Home";
import User from "./components/pages/User/page_User";
import BackTest from "./components/pages/BackTest/page_BackTesting";
import NotFound from "./components/pages/Error/page_Error";
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Figure from 'react-bootstrap/Figure'
import { store } from './redux/store'
import {LogoutAction, ChangeTimeIntervalAction} from './redux/action/action'
//login https://www.youtube.com/watch?v=sRzbFa8gYFI

// learn: Object.entries
// learn: useState prevstate 改狀態
// https://react-bootstrap.netlify.app/components/navs/

// use route to connect the path of interface
const App = (props) => {
  //const [IntervalTime, setIntervalTime] = useState("1d"); //set init. product data
  const [index_key, setIndexKey] = useState({ 'ema': false, 'boll': false, 'atr': false, 'sar': false });
  const [index_key_2, setIndexKey_2] = useState({ 'macd': false, 'kdj': false, 'rsi': false, 'mfi': false, 'cci': false, 'mdi': false, 'mtm': false });
  const onSelect = (data) => {
    store.dispatch(ChangeTimeIntervalAction(data))
  };//setIntervalTime(data);

  const Logout = () => {
    store.dispatch(LogoutAction());
  }

  // checkbox 1 用spread operator保留之前的狀態(ES6)
  function onhandleChange(event) {
    setIndexKey(prevState => ({
      ...prevState,
      [event.target.value]: !prevState[event.target.value]
    }));
  }

  // checkbox 2//
  function onhandleChange2(event) {
    const pass = Object.values(index_key_2).reduce((acc, value) => acc + value, 0);
    const status = index_key_2[event.target.value];
    if (status) {
      setIndexKey_2(prevState => ({
        ...prevState,
        [event.target.value]: !status
      }));
    } else {
      if (pass < 2) {
        setIndexKey_2(prevState => ({
          ...prevState,
          [event.target.value]: !prevState[event.target.value]
        }));
      }
      else
        alert("Only can choose 2 types in this block!!");
    }
  }

  /*
    checkbox label revise： https://stackoverflow.com/questions/59924585/im-getting-error-using-laravel-and-react-invalid-dom-property-for-did-you-m
    When using React, you can't use the for keyword in JSX, since that's a javascript keyword 
    (remember, JSX is javascript so words like for and class can't be used because they have some other special meaning!)
    To circumvent this, React elements use htmlFor instead using for.
  */
 //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
  
  /*
  if (!connected) {
    return <User />
  }
  */

  return (
    <>
        <Router>
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="/">Trading Robot Test</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/">Home</Nav.Link>
                  <NavDropdown title="K Line" id="basic-nav-dropdown" onSelect = {onSelect}> 
                    <NavDropdown.Item eventKey={"1m"} > 1 min  </NavDropdown.Item>
                    <NavDropdown.Item eventKey={"15m"}> 15 min </NavDropdown.Item>
                    <NavDropdown.Item eventKey={"1h"} > 1 hour </NavDropdown.Item>
                    <NavDropdown.Item eventKey={"8h"} > 8 hour </NavDropdown.Item>
                    <NavDropdown.Item eventKey={"1d"} > 1 day  </NavDropdown.Item>
                    <NavDropdown.Item eventKey={"1w"} > 1 week </NavDropdown.Item>
                    <NavDropdown.Item eventKey={"1M"} > 1 month</NavDropdown.Item>
                    <NavDropdown.Divider/>
                      {Object.entries(index_key).map(item => {
                        const [name, value] = item;
                        return <li key={name}>
                                  <input type="checkbox" className='app-input' id={name} value={name} checked={value} onChange={onhandleChange} />
                                  <label htmlFor={name}>{name.toUpperCase()}</label>
                              </li>;
                      })
                      }
                    <NavDropdown.Divider/>
                      {Object.entries(index_key_2).map(item => {
                        const [name, value] = item;
                        return <li key={name}>
                                <input type="checkbox" className='app-input' id={name} value={name} checked={value} onChange={onhandleChange2} />
                                <label htmlFor={name}>{name.toUpperCase()}</label>
                              </li>;
                      })
                      }
                  </NavDropdown>
                  <Nav.Link href="/test">BackTest</Nav.Link>
                  <Nav.Link href="/user">User</Nav.Link>
                </Nav>
                {(store.getState().login)?(
                  <div onClick={Logout}>
                    <Figure>
                      <Figure.Image
                        width={30}
                        height={30}
                        className="fig"
                        alt="user_connected"
                        src="user.png"
                      />
                    </Figure>
                </div>):
                (<></>)
                }
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/test" component={BackTest} />
            <Route path="/user" exact> <User /> </Route>
            <Route path='/404' component={NotFound} />
            <Redirect from='*' to='/404' />
          </Switch>
        </Router>
    </>
  );
}

// 使用 redux connect()()創建一個container 
export default(App);// 前者傳狀態用