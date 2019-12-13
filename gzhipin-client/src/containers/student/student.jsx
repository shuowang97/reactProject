/**
 * student interface container component
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import UserList from "../../components/user-list/user-list";
import {getUserList} from "../../redux/actions";

class Student extends Component{

    componentDidMount() {
        this.props.getUserList('recruiter')
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
)(Student)
