/**
 * personal interface container component
 * 个人中心页
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'
import Cookies from 'js-cookie'
import {resetUser} from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class Personal extends Component{

    logout = () => {
        Modal.alert('Sign out', 'Sure to sign out?', [
            {text: 'cancel'},
            {
                text: 'sure',
                onPress: () => {
                    // clear cookie
                    Cookies.remove('userid')
                    // clear redux 这里的resetUser是一个同步action 因为这里不需要跟后台通信 所以可以同步
                    this.props.resetUser()
                }
            }
        ])

    }


    render() {
        const {username, header, company, post, salary, info} = this.props.user
        return (
            <div style={{marginTop: 50}}>
                <Result
                    img={<img src={require(`../../assets/images/${header}.png`)} style={{width:50}}
                              alt="headers"/>}
                    title={username}
                    message={company}

                />
                <List renderHeader={() => 'relative infomation'}>
                    <Item multipleLine>
                        <Brief>Position: {post}</Brief>
                        <Brief>Information: {info}</Brief>
                        {salary ? <Brief>Salary: {salary}</Brief> : null}
                    </Item>
                    <WhiteSpace/>
                    <List>
                        <Button type='warning' onClick={this.logout}>Sign out</Button>
                    </List>
                </List>

            </div>

        )
    }
}

export default connect(
    state => ({user: state.user}),
    {resetUser}
)(Personal)
