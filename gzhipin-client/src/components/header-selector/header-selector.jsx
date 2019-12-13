/*
UI component, used to select headers
 */

import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component{

    //setHeader是一个func 且必须有
    static propTypes = {
        setHeader: PropTypes.func.isRequired
    }

    state = {
        icon: null //图片对象
    }

    constructor(props){
        super(props);
        this.headerList = []
        for (let i = 0; i < 20; i++){
            this.headerList.push({
                text: '头像' + (i + 1),
                //注意这里用的是模板字符串 不是‘’而是··
                icon: require(`../../assets/images/头像${i+1}.png`) //不能使用import 这里是动态加载
            })
        }
    }
    // 这里为什么是text和icon？ 因为默认表格返回ele元素 ele: {text: xxx, icon: xxx}
    handleClick = ({text, icon}) => {
        //更新当前组件状态
        this.setState({icon})
        //调用函数更新父组件 studentInfo or bossInfo
        this.props.setHeader(text)
    }

    render () {
        const {icon} = this.state
        //头部界面：
        const listHeader = !icon ? 'please choose a head image' : (
            <div>
                your choice: <img src={icon} alt='icon'/>
            </div>
        )
        return (
            <List renderHeader={() => listHeader}>
                <Grid data={this.headerList}
                      columnNum={5}
                      onClick={this.handleClick}
                />


            </List>


        )
    }
}