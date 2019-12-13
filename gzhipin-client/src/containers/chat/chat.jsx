/**
 * 对话聊天的路由组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, Grid, Icon} from "antd-mobile";
import '../../assets/css/index.less'
import {sendMsg, readMsg} from '../../redux/actions'
import QueueAnim from "rc-queue-anim";

const Item = List.Item

class Chat extends Component{

    state={
        content: '',
        isShow: false // whether to show the list of emoji
    }
    // callback before the first render
    componentWillMount() {
        const emojis = ['😀' ,'😃' , '😄' , '😁' , '😆' , '😅' , '🤣' , '😂' , '🙂' , '🙃' , '😉' , '😊' , '😇' , '🥰'
        , '😍' , '🤩' , '😘' , '😗' , '😚' , '😙' , '😋' , '😛' , '😜' , '🤪' , '😝' , '🤑' , '🤗' , '🤭' , '🤫'
        , '🤔' , '🤐' , '🤨' , '😐' , '😑' , '😶' , '😏' , '😒' , '🙄' , '😬' , '🤥' , '😌' , '😔' , '😪' , '🤤' , '😴'
        , '😷' , '🤒' , '🤕' , '🤢' , '🤮' , '🤧' , '🥵' , '🥶' , '🥴' , '😵' , '🤯' , '🤠' , '🥳' , '😎' , '🤓' , '🧐'
        , '😕' , '😟' , '🙁' , '☹' , '😮' , '😯' , '😲' , '😳' , '🥺' , '😦' , '😧' , '😨' , '😰' , '😥' , '😢' , '😭'
        , '😱' , '😖' , '😣' , '😞' , '😓' , '😩' , '😫' , '😤' , '😡' , '😠']
        // 利用this.emojis 可以将表情作为text存入
        this.emojis = emojis.map(value => ({text: value}))
    }
    //进入聊天页面时 自动滑动到底部
    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight)

        // 发请求更新消息的未读状态 需要一个异步action
        // 写在这里不对 因为可能进入聊天页面后 别人才发消息
        // 这个时候没有做到对于未读消息数量的更新
        /*const from = this.props.match.params.userid // 与当前用户聊天的对象id
        const to = this.props.user._id
        this.props.readMsg(from, to)*/
    }
    // 退出聊天页面时更新未读消息数量
    componentWillUnmount() {
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
    }

    //发送消息后 自动滑动到底部
    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight)
    }

    handleSend = () => {
        //收集数据
        const from = this.props.user._id
        // 这里因为使用了/:userid动态路由 所以可以从param里读取to
        const to = this.props.match.params.userid
        // trim 去掉左右的空格
        const content = this.state.content.trim()
        // 发送请求：
        if(content) {
            // 传多个数据时，默认传对象
            this.props.sendMsg({from, to, content})
        }
        // 清除输入数据
        this.setState({
            content: '',
            isShow: false
        })
    }

    // 这里表情显示有bug 必须使用一个异步的resize来解决
    toggleShow = () => {
        const isShow = !this.state.isShow
        this.setState({isShow})
        if(isShow){
            // setTimeout 默认为异步操作 尽管时间为0
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }

    render() {
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat
        // 计算当前聊天的chat_id
        const myId = user._id
        const targetId = this.props.match.params.userid //能这样用是因为chat组件是动态路由
        const chatId = [myId, targetId].sort().join('_');
        //第一次render  users可能还没数据 直接return 等待下次render
        if(!users[myId]){
            return null
        }
        // 对chatMsgs进行过滤
        // 这里对于返回的msgs有两种情况 一种是发出的 or 收到的
        const msgs = chatMsgs.filter(msg => msg.chat_id===chatId)
        // 得到目标用户的header
        const targetHeader = users[targetId] ? users[targetId].header : null;
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null

        return (
            <div id='chat-page'>
                <NavBar
                    icon={<Icon type='left'/>}
                    className='stick-head'
                    // goBack 返回之前的路由
                    onLeftClick={() => this.props.history.goBack()}
                >
                    {users[targetId].username}
                </NavBar>
                <List style={{marginTop:50, marginBottom:50}}>
                    <QueueAnim type='left' delay={5}>
                        {
                            msgs.map(msg => {
                                if(targetId===msg.from){ // receive msg
                                    return (
                                        <Item
                                            // 每个通过map遍历的 都需要一个key
                                            key={msg._id}
                                            thumb={targetIcon}
                                        >
                                            {msg.content}
                                        </Item>
                                    )
                                }else{ // send msg
                                    return(
                                        <Item
                                            key={msg._id}
                                            className='chat-me'
                                            extra='me'
                                        >
                                            {msg.content}
                                        </Item>
                                    )
                                }
                            })
                        }
                    </QueueAnim>
                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        // 用value来更新inputItem里面的值
                        value={this.state.content}
                        onChange={val => this.setState({content: val})}
                        // 当选完表情后 表格自动隐藏
                        onFocus={() => this.setState({isShow: false})}
                        placeholder='please input here'
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{marginRight:5}}>😊</span>
                                <span onClick={this.handleSend}>send</span>
                            </span>
                        }
                    />
                    {this.state.isShow ? (
                        <Grid
                            data={this.emojis}
                            columnNum={8}
                            carouselMaxRow={4}
                            // carousel 轮播
                            isCarousel={true}
                            onClick={item => {
                                this.setState({
                                    content: this.state.content + item.text
                                })
                            }}

                        />
                    ) : null}
                </div>

            </div>
        )
    }
}
export default connect(
    state => ({user: state.user, chat: state.chat}),
    {sendMsg, readMsg}
)(Chat)




