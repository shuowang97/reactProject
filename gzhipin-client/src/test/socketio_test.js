import io from 'socket.io-client'

// 连接服务器 得到与服务器的连接对象
const socket = io('ws://localhost:4000')

// send msg
socket.emit('sendMsg', {name: 'abc'})
console.log('client send message to server', {name: 'abc'})
// 绑定监听 接收服务器发送的消息
socket.on('receiveMsg', function (data) {
    console.log('client receive message from server', data)
})
