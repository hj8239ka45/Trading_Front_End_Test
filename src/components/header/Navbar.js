//doesn't use in this version
import React,{Component, useState} from "react";
//import { Link } from "react-router-dom";
//import * as FaIcons from "react-icons/fa";
//import * as AiIcons from "react-icons/ai";
//import {SidebarData} from './SlidebarData';
import {MenuItems} from "./MenuItems";
import './Navbar.css';
//import { IconContext } from 'react-icons';
/**/
class Navbar extends Component {
    state = { clicked : false};
    handleClick = () =>{
        this.setState({ clicked: this.state.clicked })
    }
    render(){
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">React<i className="fab fa-react"></i></h1>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times':'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked? 'nav-menu active':'nav-menu'}>
                    {MenuItems.map((items, indexs) => {
                        return (
                            <li key={indexs}>
                                <a className={items.cName} href={items.url}>
                                {items.title}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        )
    }
} export default Navbar;

/*
// sidebar 
function Navbar(){
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    return(
        <>
        <IconContext.Provider value={{color : '#fff'}}>
            <div className="navbar">
                <Link to="#" className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar}/>
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle' >
                        <Link to="#" className='menu-bars'>
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {SidebarData.map((items, indexs) =>{
                        return(
                            <li key={indexs} className={items.cName} >
                                <Link to={items.path}>
                                    {items.icon}
                                    <span>{items.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            </IconContext.Provider>
        </>
    )
}export default Navbar

*/