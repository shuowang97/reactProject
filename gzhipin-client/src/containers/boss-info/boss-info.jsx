/*
* this module is used to complete info for recruiters
* */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import HeaderSelector from "../../components/header-selector/header-selector";
import {NavBar,
        InputItem,
        TextareaItem,
        Button,
} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {updateUser} from '../../redux/actions'

class BossInfo extends Component{

    state = {
        header: '',
        post: '',
        info: '',
        company: '',
        salary: '',
    }

    //update head image
    setHeader = (header) => {
        this.setState({
            header: header
        })
    }

    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    save = () => {
        this.props.updateUser(this.state)
    }

    render() {
        const {header, type} = this.props.user
        if(header) {  // 说明信息已完善
            const path = type === 'student' ? '/student' : '/boss'
            return <Redirect to={path}></Redirect>
        }
        return (
            <div>
                <NavBar>Recruiter info completion</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder='please input your needed position'
                           onChange={val => {this.handleChange('post', val)}}>Job position</InputItem>
                <InputItem placeholder='please input your company name'
                           onChange={val => {this.handleChange('company', val)}}>Company</InputItem>
                <InputItem placeholder='please input the salary you will offer'
                           onChange={val => {this.handleChange('salary', val)}}>Salary</InputItem>
                <TextareaItem title='Require' rows={3}
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
)(BossInfo)