/*
no need to interaction, using function component rather than class component
 */
import React from "react";
import './logo.less'; //format
import logo from './logo.png' // picture
//函数组件
export default function Logo() {
    return(
        <div className="logo-container">
            <img src={logo} alt="logo" className='logo-img'/>
        </div>
    )
    
}