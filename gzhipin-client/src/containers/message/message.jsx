/**
 * message interface container component
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from "antd-mobile";

const Item = List.Item
const Brief = Item.Brief

/*
divide chatMsgs into different groups based on the 'chat_id' and return the array of last message
1. 找出每个聊天的lastMsg 并且存储在对象容器里 格式为{chat_id, lastMsg}
2. 找出全部的lastMsg组成的数组
3. 将lastMsg降序排序 depend on create_time
 */
// 这里的每一个chatMsgs 经过reducer的处理 都已经有了unReadCount属性
function getLastMsgs(chatMsgs, userid) {
    //1. 找出每个聊天的lastMsg 并且存储在对象容器里 格式为{chat_id: lastMsg}
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {

        // 统计unread Msg的个数
        if(msg.to === userid && !msg.read){
            // 当前消息的unReadCount = 1
            msg.unReadCount = 1
        }else{
            msg.unReadCount = 0
        }
        // 对于每一个msg 取它的chatId
        const chatId = msg.chat_id
        const lastMsg = lastMsgObjs[chatId]
        // 若当前没有存lastMsg 则存入 否则比较创建时间
        if(!lastMsg){
            // 这里msg的unReadCount 就是结果 --> 比如现在只有一条消息 就是1
            lastMsgObjs[chatId] = msg
        }else{
            // 这里需要对unReadCount进行累加
            const unReadCount = lastMsg.unReadCount
            if(msg.create_time > lastMsg.create_time){
                lastMsgObjs[chatId] = msg;
            }
            // 累加结果 并保存在最新的lastMsg上
            lastMsgObjs[chatId].unReadCount = unReadCount + msg.unReadCount
        }
    })
    //2. 找出全部的lastMsg组成的数组
    const lastMsgs = Object.values(lastMsgObjs)
    //3. 将lastMsg降序排序 depend on create_time
    lastMsgs.sort(function (m1, m2){
        return m2.create_time - m1.create_time
    })
    return lastMsgs

}

class Message extends Component{

    render() {
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat
        const lastMsgs = getLastMsgs(chatMsgs, user._id)
        // 对chatMsgs进行分组 并显示对应组的最后一条消息 这里应该按照chat_id分组
        // 注意 这里如果没有this的话 必须写在class外面
        //const lastMsgs = this.getLastMsgs(chatMsgs)

        return (
            <List style={{marginTop:50, marginBottom:50}}>
                {
                    lastMsgs.map((msg) => {
                        // 如果当前id 等于 目标id 则说明这条消息是对方发送的
                        const targetUserId = msg.to===user._id ? msg.from : msg.to
                        const targetUser = users[targetUserId]
                        return (
                            <Item
                            key={msg._id}
                            extra={<Badge text={msg.unReadCount}></Badge>}
                            thumb={require(`../../assets/images/${targetUser.header}.png`)}
                            arrow='horizontal'
                            // 点击跳转聊天界面 使用动态路由的特性 并且必须使用push 因为chat页面有goBack操作
                            onClick={() => {this.props.history.push(`/chat/${targetUserId}`)}}
                            >
                                {msg.content}
                            <Brief>{targetUser.username}</Brief>
                            </Item>
                        )

                    })
                }


            </List>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
    {}
)(Message)
