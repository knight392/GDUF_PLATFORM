import {getToken, loginRequest} from './tools'
// user为null,表示没有登录
let user = null;

// 每次加载页面都看看有没有token,可自动登录
(function(){
  const token = getToken();
  if(token != null){
    try{
      // 有token就发送一个token的cookie
      user =  doLogin()
    }catch(e) {
      console.log(e);
      user = null;
    }
  }
})()

function doLogOff(){
  user = null;
  $.removeCookie('token')
}
/**
 * 
 * @param {*} loginData (可以是{loginValue, password, requestType, userType}对象 或 不发，此时用token验证)
 * @returns 
 */
// 
function doLogin(loginData = null){
  loginRequest(loginData).then(res => {
    user = res
  }, err => {
    user = null
  })
}

function isLogin() {
  return user == null ? true : false
 }

export {user, doLogOff, doLogin, isLogin}










