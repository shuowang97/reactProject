/*
* this module is used to complete info for recruiters
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar,
        InputItem,
        Button,
        TextareaItem,
} from "antd-mobile";
import HeaderSelector from "../../components/header-selector/header-selector";
import {updateUser} from "../../redux/actions";
import {Redirect} from 'react-router-dom'

class StudentInfo extends Component{


    state = {
        header: '',
        post: '',
        info: '',
    }

    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    setHeader = (header) => {
        this.setState({
            header: header
        })
    }

    save = () => {
        this.props.updateUser(this.state)
    }

    render() {
        const {type, header} = this.props.user
        if(header) {
            let path = type === 'recruiter' ? '/boss' : '/student'
            return <Redirect to={path}></Redirect>
        }

        return (
            <div>
                <NavBar>Student info completion</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder='please input your purpose position'
                           onChange={val => {this.handleChange('post', val)}}>Position</InputItem>
                <TextareaItem title='Introduction' rows={3}
                              onChange={val => {this.handleChange('info', val)}}></TextareaItem>
                <Button type='primary'
                           onClick={this.save}>s&nbsp;a&nbsp;v&nbsp;e</Button>
            </div>

        )
    }
}

export default connect(
    state => ({user: state.user}),
    {updateUser}
)(StudentInfo)