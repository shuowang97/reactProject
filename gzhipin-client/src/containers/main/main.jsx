/*
main route component
 */

import React, {Component} from "react"
import {Switch, Route, Redirect} from 'react-router-dom'
import {NavBar} from "antd-mobile";
import BossInfo from '../boss-info/boss-info'
import StudentInfo from '../student-info/student-info'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {getRedirectTo} from '../../utils/index'
import {getUser} from '../../redux/actions'
import Message from '../message/message'
import Student from '../student/student'
import Boss from '../boss/boss'
import Personal from '../personal/personal'
import NotFound from "../../components/not-found/not-found";
import NavFooter from "../../components/nav-footer/nav-footer";
import Chat from '../chat/chat'

class Main extends Component{

    // 不加static代表给组件对象添加属性， 加了static代表给组件类添加属性
    navList = [
        {
            path: '/boss',
            component: Boss,
            title: 'Student list',
            icon: 'student',
            text: 'student'
        },
        {
            path: '/student',
            component: Student,
            title: 'Recruiter list',
            icon: 'boss',
            text: 'boss'
        },
        {
            path: '/message',
            component: Message,
            title: 'Message list',
            icon: 'message',
            text: 'message'
        },
        {
            path: '/personal',
            component: Personal,
            title: 'Personal center',
            icon: 'personal',
            text: 'personal'
        },
    ]


    componentDidMount() {
        //需要先发送异步action获取user
        //如果登录过（cookie中有userid） 但是目前没有登录（redux里的user没有_id） 这就需要我们发送异步请求获取_id
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if(userid && !_id){
            //登录过 但目前没有登录 --> 发送请求 获取user信息
            this.props.getUser()
        }
    }

    render() {

        // 渲染前 检查用户是否登录  没登陆则自动重定向到登录页面 登录了则跳转对应界面
        // 读取cookie中的userid 需要js-cookie库 set() & remove()
        const userid = Cookies.get('userid')
        //1. 如果没有 自动重定向到登录界面
        if(!userid) {
            return <Redirect to='/login'></Redirect>
        }

        //2. 如果有 读取redux中的user状态值 这里依赖于componentDidMount里发送请求 获取了user
        const {user, unReadCount} = this.props // 这里取unReadCount是为了在NavFooter里传入
        // 2.1 如果user没有_id  不做任何显示(null) 这是因为componentDidMount发生在第一次render之后 所以第一次return null
        if(!user._id) {
            return null
        }else{
            // 2.2 如果user有_id 显示对应的界面
            let path = this.props.location.pathname // location class similar to history class
            // 2.2.1  如果访问根目录 '/' 则根据user type&header重新定向
            if(path === '/') {
                path = getRedirectTo(user.type, user.header)
                return <Redirect to={path}></Redirect>
            }
        }


        const {navList} = this
        const path = this.props.location.pathname
        // currentNav may not exist
        const currentNav = navList.find(nav => nav.path === path)
//        {/*这里本身有4个小组件，底部导航应该显示3个，所以要根据用户类型hide一个*/}
        if(currentNav) {
            // 决定哪个路由隐藏
            if(user.type === 'recruiter'){
                // 隐藏数组第二个  给第二个元素 加一个hide属性 并且为true
                navList[1].hide = true
            }else {
                // 隐藏数组第一个
                navList[0].hide = true
            }
        }

        return (
            <div>
                {/*只有4个页面需要navBar*/}
                {currentNav ? <NavBar className='stick-head'>{currentNav.title}</NavBar> : null}
                <Switch>

                    {
                        navList.map(nav => <Route path={nav.path} component={nav.component}></Route>)
                    }

                    <Route path='/bossinfo' component={BossInfo}></Route>
                    <Route path='/studentinfo' component={StudentInfo}></Route>
                    {/*这里用了/:userid动态路由的方式，所以取值时有req.params*/}
                    <Route path='/chat/:userid' component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {/*这里本身有4个小组件，底部导航应该显示3个，所以要根据用户类型hide一个*/}
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
            </div>
        )
    }
}

//这里本身不需要发请求 所以没有connect的第二个参数
//这里发送请求后 user会自动更新 然后自动重新render
export default connect(
    state => ({user: state.user, unReadCount: state.chat.unReadCount}),
    {getUser}
)(Main)

/*
1. 实现自动登录
    1.1 if cookie has userid
        1.1.1 if redux does not have _id, get user by requesting: (ComponentDidMount)
        1.1.2 if redux has _id, means user has login, show the right interface: (render())
              special case: if in the '/' path, then compute the right path based on type & header: (render())
    1.2 if cookie doesn't have userid --> redirect to login: (render())

2. 如果已经登录，并且请求根路径 '/'
    根据type, header 计算出重定向的路径
 */