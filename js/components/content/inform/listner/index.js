
// 当有用户登录后就要启动
import { user } from '../../../../common/user/index.js';
import { receiveInfo } from '../notification.js'


let ws;

// 连接方法, 可以在dologin中调用
function createWebSocket(wsUrl) {
  return new Promise((resolve, reject) => {
    if (ws) { ws.close() }
    ws = new WebSocket(wsUrl)
    ws.onmessage = function (e) {
      receiveInfo(e.data);
    }
    ws.onopen = function(){
      receiveInfo()
      resolve(true)
    }
    ws.onerror = function (){
      reject(false)
    }
  })
}

/**
 * 外部调用，只需通知接收方有新信息
 */
function sendInfoWs(message,receiver) {
  ws.send(JSON.stringify({
    senderName: user.userName,
    senderFace: user.face,
    senderMarkNumber:user.markNumber,
    receiverMarkNumber: receiver.markNumber,
    receiverName: receiver.userName,
    content: message
  }))
}

// 接收消息时间


function closeWebSocket() {
  if (ws) {
    ws.close();
  }
}

// 只有接收， onMessage事件，根据返回的数据类型做不同的处理


export { createWebSocket, sendInfoWs, closeWebSocket }