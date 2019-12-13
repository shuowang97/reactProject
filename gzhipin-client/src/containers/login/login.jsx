/*
login route component
 */

import React, {Component} from "react"
import Logo from "../../components/logo/logo"
import {NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

class Login extends Component{
    state = {
        username: '',
        password: ''
    }

    login = () => {
        this.props.login(this.state)
    }

    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    toRegister = () => {
        this.props.history.replace('/register')
    }

    render() {
        const {msg, redirectTo} = this.props.user
        if(redirectTo) {
            return <Redirect to={redirectTo}></Redirect>
        }


        return (
            <div>
                <NavBar>F&nbsp;i&nbsp;n&nbsp;d</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}
                        <WhiteSpace/>
                        <InputItem placeholder='please input your username' onChange={val => this.handleChange('username', val)}>Username: </InputItem>
                        <InputItem placeholder='please input your password' type="password" onChange={val => this.handleChange('password', val)}>Password: </InputItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.login}>Sign in</Button>
                        <Button onClick={this.toRegister}>Need to sign up?</Button>
                    </List>
                </WingBlank>

            </div>
        )
    }

    
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)