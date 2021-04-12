let lockReconnect = false;//避免重复连接
let wsUrl;
let ws;
let tt;
function createWebSocket(wsUrl_p) {
  wsUrl = wsUrl_p;
  try {
    ws = new WebSocket(wsUrl);
    init();
  } catch (e) {
    console.log('catch');
    reconnect(wsUrl);
  }
}
function init() {
  ws.onclose = function () {
    console.log('链接关闭');
    reconnect(wsUrl);
  };
  ws.onerror = function () {
    console.log('发生异常了');
    reconnect(wsUrl);
  };
  ws.onopen = function () {
    //心跳检测重置
    heartCheck.start();
  };
  ws.onmessage = function (event) {
    //拿到任何消息都说明当前连接是正常的
    console.log('接收到消息');
    heartCheck.start();
  }
}
function reconnect(url) {
  if (lockReconnect) {
    return;
  };
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt);
  tt = setTimeout(function () {
    createWebSocket(url);
    lockReconnect = false;
  }, 10000);
}
//心跳检测
let heartCheck = {
  timeout: 20000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function () {
    console.log('start');
    let self = this;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      console.log('55555');
      ws.send("123456789");
      self.serverTimeoutObj = setTimeout(function () {
        console.log(111);
        console.log(ws);
        ws.close();
        // createWebSocket();
      }, self.timeout);

    }, this.timeout)
  }
}
createWebSocket(wsUrl);