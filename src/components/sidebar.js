import React from 'react';
import './sidebar.css';
import { NavLink } from "react-router-dom";

function SideBar() {

    return (
        <div className="sidebar-container">
             <NavLink exact to="/">
                <div className="sidebar-header">
                    Expense Tracker
                </div>
            </NavLink>
            <div className="sidebar-content">
                <NavLink exact to="/" activeClassName="sidebar-active">
                    <div className="sidebar-item"> 
                    {/* <i className="fa fa-home" aria-hidden="true"></i> */} Dashboard
                     </div>
                </NavLink>
                <NavLink exact to="/expense" activeClassName="sidebar-active">
                    <div className="sidebar-item">
                    {/*  <i className="fa fa-money-check" aria-hidden="true"></i>  */}Expense Management 
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default SideBar;