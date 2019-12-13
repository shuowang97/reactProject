/*
register route component
 */

import React, {Component} from "react";
import Logo from '../../components/logo/logo'
import {NavBar,
        WingBlank,
        List,
        InputItem,
        WhiteSpace,
        Radio,
        Button
} from 'antd-mobile'
// 这里register组件需要与redux交互 实现注册功能
import {connect} from 'react-redux'
import {register} from '../../redux/actions'
import {Redirect} from 'react-router-dom'


const ListItem = List.Item;

class Register extends Component{
    state = {
        username: '',
        password: '',
        password2: '', // verified password
        type: 'recruiter' // student recruiter
    }
    //create function
    register = () => {
        this.props.register(this.state)
    }

    handleChange = (name, val) => {
        //update state
        this.setState({
            [name]: val // name is not the property, it is a string. [name] to get the property
        })
    }

    toLogin = () => {
        this.props.history.replace('/login')
    }

    render() {
        const {type} = this.state
        // 这里的this.props.user是最下面得到的
        const {msg, redirectTo} = this.props.user
        // 如果redirectTo有值，说明需要重定向
        if(redirectTo) {
            return <Redirect to={redirectTo}></Redirect>
        }
        return (
            <div>
                {/*&nbsp used to create whitespace between chars*/}
                <NavBar>F&nbsp;i&nbsp;n&nbsp;d</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg ? <div className='error-msg'>{msg}</div> : null}
                        <WhiteSpace/>
                        <InputItem placeholder='please input your username' onChange={val => {this.handleChange('username', val)}}>Username: </InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='please input your password' type="password" onChange={val => {this.handleChange('password', val)}}>Password: &nbsp;</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='please verify your password' type="password" onChange={val => {this.handleChange('password2', val)}}>Verify: </InputItem>
                        <WhiteSpace/>
                        <ListItem>
                            <span>User type: </span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='student'} onChange={() => this.handleChange('type','student')}>Student</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='recruiter'} onChange={() => this.handleChange('type','recruiter')}>Recruiter</Radio>
                        </ListItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.register}>Sign up</Button>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.toLogin}>Sign In</Button>

                    </List>
                </WingBlank>
            </div>
        )
    }


}

/**
 * 你可能会问，如果一个组件既有 UI 又有业务逻辑，那怎么办？回答是，将它拆分成下面的结构：外面是一个容器组件，
 * 里面包了一个UI 组件。前者负责与外部的通信，将数据传给后者，由后者渲染出视图。
 * 这里上面的部分就是UI组件，下面的部分就是容器组件
 * React-Redux 提供connect方法，用于从 UI 组件生成容器组件。connect的意思，就是将这两种组件连起来。
 */

export default connect(
    //（1）输入逻辑：外部的数据（即state对象）如何转换为 UI 组件的参数
    // (2）输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传给 Store。
    // 这里的user是reducer里传进来的值
    state => ({user: state.user}),
    {register}, //这里执行完毕后, 回到reducer, 再从reducer传值进来
) (Register)