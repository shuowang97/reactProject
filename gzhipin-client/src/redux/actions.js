/*
include action creators
async action: register and login
sync action
 */
import io from 'socket.io-client' // 每次发消息(emit)都要触发请求
import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqMsgList,
    reqReadMsg,
} from "../api";
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

/*
    单例对象：
    这里socket要声明为单例对象，即多次调用initIO的情况下 socket只被生成一次
    1. 创建对象之前: judge whether the object has been created, if not, then create
    2. 创建对象之后: save the object 这里可以将socket保存到io里
 */
function initIO(dispatch, userid) {
    if(!io.socket){
        //connect to server
        io.socket = io('ws://localhost:4000')
        //listen to server and get message sent by server
        io.socket.on('receiveMsg', function(chatMsg) {
            console.log('client receives message from server', chatMsg)
            // 由于服务器端向全部客户端都发送了msg, 这里客户端要筛选发给自己的消息, 然后分发同步action保存
            if(userid===chatMsg.from || userid===chatMsg.to) {
                dispatch(receiveMsg(chatMsg, userid)) // 这里也是更新chat的reducer 所以能重新渲染
            }

        })
    }
}
// 异步获取消息列表数据  3个地方需要调用：注册、登录、自动登录过程(getUser)
// 这里是一个函数 写成这样的目的是为了让其他的action调用它 然后dispatch一个receiveMsgList的action
async function getMsgList(dispatch, userid) {
    initIO(dispatch, userid) // 当用户登录成功后，调用initIO方法 实现对于消息的监听
    const response = await reqMsgList()
    const result = response.data
    if(result.code === 0){
        const {users, chatMsgs} = result.data
        // 为什么要传入userid？ 因为需要在reducer里计算unReadCount总数
        dispatch(receiveMsgList({users, chatMsgs, userid})) // 这里也是更新chat的reducer 所以能重新渲染
    }
}
/*
    这里整个socket过程是
    1. 点击后send到server
    2. 从server保存 并emit回来
    3. client端接收并分发receiveMsg
 */

//发送消息的异步action 这里发消息用socket 不用ajax发送请求
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        console.log('client send msg to server', {from, to, content})
        //send message to server
        io.socket.emit('sendMsg', {from, to, content})
    }
}

//读取消息的异步action
export const readMsg = (from, to) => {
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code === 0){
            // count: 后台返回 有几条消息标为已读了
            const count = result.data
            dispatch(msgRead({count, from, to}))
        }
    }
}



//每一个action-type都必须对应一个同步action 这样才能给reducer使用
// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
//错误信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
//接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
//重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
//接收用户列表的同步action 这里不必export
const receiveUserList = (userList) => ({type: RECEIVE_USERLIST, data: userList})
//接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSGLIST, data: {users, chatMsgs, userid}})
//接收一个消息的同步action 这里输入可以用对象 也可以用()
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
//已读一条消息的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})

// 注册异步action    reqRegister return: promise object
// 1. 利用await async读值  2. 利用.then()读值
export const register = (user) => {
    //register.js传入的对象多了password2 这里去掉
    const {username, password, password2, type} = user
    // front end check for form, return a sync action errorMsg() if not equal
    if(password !== password2){
        return errorMsg('please verify the password')
    }
    else if(!username){
        return errorMsg('please input your user`name')
    }
    //前台判断完后，发送一个异步的ajax请求
    return async dispatch => {
        //发送注册请求 async  ajax request
        //use .then() to get data  --> not concise
/*        const promise = reqRegister(user)
        promise.then(request => {
            const result = request.data   // {code: xx, data: user, msg:xx}
        })*/
        // 本来是先获得promise对象 然后再利用then方法来获取数据
        // 直接用await 和 async 相当于等待await后的方法完成后 再执行
        // reqRegister跳转到api里的index 然后利用ajax发送请求给后台 后台完成后 返回response
        const response = await reqRegister({username, password, type})
        const result = response.data
        if(result.code === 0){
            getMsgList(dispatch, result.data._id) //注册成功后，获取当前用户的消息列表
            //分发成功的action
            dispatch(authSuccess(result.data))
        }else{
            dispatch(errorMsg(result.msg))
        }
    }
}
//异步登录请求
export const login = (user) => {
    const {username, password} = user
    if(!username){
        return errorMsg('please input your username')
    }
    else if(!password){
        return errorMsg('please input your password')
    }


    return async dispatch => {
/*        const promise = reqLogin(user)
        promise.then(request => {
            const result = request.data
        })*/
        // reqLogin跳转到api里的index 然后利用ajax发送请求给后台 后台完成后 返回response
        const response = await reqLogin({username, password})
        const result = response.data
        if(result.code === 0){
            getMsgList(dispatch, result.data._id) //登录成功后，获取当前用户的消息列表
            dispatch(authSuccess(result.data)) //result: {code: 1/0, data: user, msg: }
        }else{
            dispatch(errorMsg(result.msg))
        }
    }
}
//异步action（更新）请求
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdateUser(user)
        const result = response.data
        if(result.code === 0){
            // success -> result.data = user
            dispatch(receiveUser(result.data)) //分发同步action
        }else {
            //这里如果出现错误，说明需要重新登录
            dispatch(resetUser(result.msg))
        }
    }
}

// 获取用户异步action
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if(result.code === 0) {
            getMsgList(dispatch, result.data._id) //自动登录成功后，获取当前用户的消息列表
            dispatch(receiveUser(result.data))
        }else {
            dispatch(resetUser(result.msg))
        }
    }
}

// 获取用户列表的异步action
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type)
        const result = response.data
        if(result.code === 0){
            dispatch(receiveUserList(result.data))
        }
    }
}

