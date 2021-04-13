
// 当有用户登录后就要启动


let ws;
let COMMONINFO = 1;

// 连接方法, 可以在dologin中调用
function createWebSocket(wsUrl) {
  ws  = new WebSocket(wsUrl)
  ws.onmessage = function(e){
    receiveInfo(e.data);
  }}

/**
 * 外部调用，只需通知接收方有新信息
 */
function sendInfoWs(receiver) {
  ws.send(JSON.stringify({type: COMMONINFO, receiver}))
}

// 接收消息时间
function receiveInfo(data) {

}

function closeWebSocket() {
  if(ws) {
    ws.close();
  }
}

// 只有接收， onMessage事件，根据返回的数据类型做不同的处理


export {createWebSocket,sendInfoWs, closeWebSocket}