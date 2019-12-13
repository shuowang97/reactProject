/*
* include multiple interface requests function
* 包含了多个接口请求的函数的模块
* return: promise object
* using ajax to send request
* */
import ajax from './ajax'
// do not write export default. need to export multiple functions
// export function xxx() or =>
// register interface
export const reqRegister = (user) => ajax('/register', user, 'POST')
// login interface
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST')
// update user interface
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')
// get user info interface
export const reqUser = () => ajax('/user')
// get userlist     {type} 相当于把type封装成对象
export const reqUserList = (type) => ajax('/userlist', {type})
// get msgList
export const reqMsgList = () => ajax('/msglist')
// sign as "read"
export const reqReadMsg = (from) => ajax('/readmsg', {from}, 'POST')