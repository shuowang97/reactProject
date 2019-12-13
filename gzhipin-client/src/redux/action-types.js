/*
include name constants for action types
 */
// 这里后面''是F12-Redux里显示的数据！
export const AUTH_SUCCESS = 'auth_success' //注册/登录成功的action
export const ERROR_MSG = 'error_msg' //错误提示信息的action  请求前(可能非法)/请求后(code === 1)
export const RECEIVE_USER = 'receive_user' //接收用户
export const RESET_USER = 'reset_user' //重置用户

//上面4个都是对reducer里的user进行处理 但是这个action是对userlist 所以需要写一个新的reducer
export const RECEIVE_USERLIST = 'receive_userlist' //接收用户列表数据

// 对于reducer里的chat进行处理
export const RECEIVE_MSGLIST = 'receive_msglist' // 接收所有相关消息列表
export const RECEIVE_MSG = 'receive_msg' // 接收一条消息
export const MSG_READ = 'msg_read' // 已读一条消息
