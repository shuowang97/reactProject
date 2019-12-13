/*
include reducers functions: return a new state based on the old state and specific action
从后台返回的数据 利用redux管理起来
reducer 只是一个接收 state 和 action，并返回新的 state 的函数
 */
import {combineReducers} from 'redux'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USERLIST,
    RECEIVE_MSGLIST,
    RECEIVE_MSG,
    MSG_READ,
} from "./action-types";
import {getRedirectTo} from "../utils";

// 这里密码不会被后台返回
const initUser = {
    username: '',
    type: '',
    msg: '', // error msg
    redirectTo: '' //完成action后进行重定向
}

// 产生user对象的reducer
function user(state=initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:   // data is user
            const {type, header} = action.data
            // 这里redirectTo 对应四个页面 1.boss info 2. student info 3. boss main 4. student main
            return  {...action.data, redirectTo: getRedirectTo(type, header)} // 用action.data的值来替换state里的值
        case ERROR_MSG:      // data is msg
            return  {...state, msg: action.data}
        case RECEIVE_USER:  //这里不用redirect重定向是因为本身bossinfo&studentinfo都是二级路由 在main.jsx一级路由解决重定向问题即可
            return action.data //这里去向明确 一定去/student or /boss页面
        case RESET_USER: //这里本来已经在userinfo页面了 这一步可以把原来的user重新置为initUser 强制跳转回登录页面 相当于完成了强制访问userinfo页面的回转
            return {...initUser, msg: action.data}
        default:
            return state
    }
}

// 产生userlist的reducer
const initUserList = []
function userList(state=initUserList, action){
    switch (action.type) {
        case RECEIVE_USERLIST:
            return action.data
        default:
            return state
    }
}

const initChat = {
    users: {},  // 所有用户信息的对象 属性名：userid  属性值：{username, header}
    chatMsgs: [], // 当前用户的所有msg
    unReadCount: 0 // 总的未读消息数量
}
// 产生聊天状态的reducer
function chat(state=initChat, action) {
    switch (action.type) {
        case RECEIVE_MSGLIST:  // data: {users, chatMsgs}
            const {users, chatMsgs, userid} = action.data;
            return {
                users,
                chatMsgs,
                // 这里计算unReadCount里需要userId的值 但不能改变function chat 只能从action.data里获取 即从actions里获取
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal+(!msg.read && msg.to===userid? 1 : 0), 0)
            }
        case RECEIVE_MSG: // data: chatMsg
            // 这里想接收多个数据 必须写成包含多个数据的对象
            const {chatMsg} = action.data
            return {
                users: state.users,
                // 这里不能对原来的chatMsgs进行push 因为reducer这里是纯函数 只能生成新的
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (chatMsg.to===action.data.userid ? 1 : 0)
            }
        case MSG_READ: // data: count from to
            const {count, from, to} = action.data
            // 不能直接下面这样写 因为reducer是纯函数 不能修改 只能新建
            // 数组的map方法不会改变数组里原来的值 而是将数组里的元素增加新的属性
            /*state.chatMsgs.forEach(msg => {
                if(msg.from === from && msg.to === to && !msg.read){
                    msg.read = true
                }
            })*/
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from === from && msg.to === to && !msg.read){
                        // msg.read = true; 不能这样写  这样算修改
                        return {...msg, read:true} //产生新的msg
                    }else{
                        return msg
                    }
                }),
                unReadCount: state.unReadCount - count
            }
        default:
            return state
    }
}


export default combineReducers({
    user,
    userList,
    chat
})
// exposed structure: {user: {}, userList: [], chat: {}} 这里可以与register.jsx & login.jsx 交互

