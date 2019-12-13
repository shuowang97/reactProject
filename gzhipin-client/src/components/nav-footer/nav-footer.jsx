import React, {Component} from 'react'
import {TabBar} from "antd-mobile";
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'

const Item = TabBar.Item

// 希望在非路由组件中使用路由库的api  --> withRouter
class NavFooter extends Component{

    //从父组件接收数据之前，需要先声明
    static propTypes = {
        navList: PropTypes.array.isRequired,
        // 这里不能自己从reducer里拿 因为是UI组件 所以需要从父组件里传值
        unReadCount: PropTypes.number.isRequired
    }

    render() {
        let {navList, unReadCount} = this.props
        //过滤掉hide==true的nav  留下nav不为true的 加！
        navList = navList.filter(nav => !nav.hide)
        //这里下面的用法不对 因为当前的nav-footer不是路由组件
        const path = this.props.location.pathname
        return (
            <TabBar>
                {
                    navList.map((nav) => (
                        <Item key={nav.path}
                              badge={nav.path === '/message' ? unReadCount : 0}
                              title={nav.text}
                              icon={{uri: require(`./images/${nav.icon}.png`)}}
                              selectedIcon={{uri: require(`./images/${nav.icon}-selected.png`)}}
                              selected={path === nav.path}
                              onPress={() => this.props.history.replace(nav.path)}
                        />

                    ))
                }
            </TabBar>
        )
    }
}

//向外暴露withRouter() 包装产生的组件  类似于connect
//内部会向当前组件中传入一些路由组件的特有属性：history location match
export default withRouter(NavFooter)



