/*
UI component that shows specific userlist
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {WingBlank,
        WhiteSpace,
        Card,
} from "antd-mobile";
import {withRouter} from 'react-router-dom'
import QueueAnim from "rc-queue-anim";

const Header = Card.Header
const Body = Card.Body

class UserList extends Component{
    //当需要参数传入时 必须加上propTypes
    static propTypes = {
        userlist: PropTypes.array.isRequired
    }
    render() {
        const {userlist} = this.props
        return (
            // 加css格式解决底部显示不全的问题
            <WingBlank style={{marginBottom: 50, marginTop: 50}}>
                <QueueAnim type='scale'>
                    {
                        userlist.map(user => (
                            <div key={user._id}>
                                <WhiteSpace/>
                                {/*要回退时 用push方法 不回退时 用replace()*/}
                                {/*这里是非路由组件 不能直接拿props.history 需用withRouter*/}
                                {user.header ? <Card onClick={() => {this.props.history.push(`/chat/${user._id}`)}}>
                                    <Header
                                        thumb={require(`../../assets/images/${user.header}.png`)}
                                        extra={user.username}
                                    />
                                    <Body>
                                        <div>Position: {user.post}</div>
                                        {user.company ? <div>Company: {user.company}</div> : null}
                                        {user.salary ? <div>Salary: {user.salary}</div> : null}
                                        <div>Information: {user.info}</div>
                                    </Body>
                                </Card> : null}
                            </div>
                        ))
                    }
                </QueueAnim>

            </WingBlank>
        )
    }
}

export  default withRouter(UserList)