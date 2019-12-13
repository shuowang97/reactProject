/**
 * boss interface container component
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import UserList from "../../components/user-list/user-list";
//这里必须加{} 因为export多个！！
import {getUserList} from '../../redux/actions'
class Boss extends Component{
    //发送ajax请求
    componentDidMount() {
        //获取userlist
        this.props.getUserList('student')
    }

    render() {
        return (
            <UserList userlist={this.props.userList}></UserList>
        )
    }
}

export default connect(
    state => ({userList: state.userList}),
    {getUserList}
)(Boss)
