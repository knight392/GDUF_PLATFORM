import {getLocalUser, setLocalUser, removeLocalUser, loginRequest} from './tools.js'
// user为null,表示没有登录
let user = null;

// 每次加载页面都看看有没有token,可自动登录
(function(){
  const user = getLocalUser();
  if(user != null){
    try{
      // 有token就发送一个token的cookie
      user =  doLogin()
    }catch(e) {
      console.log(e);
      user = null;
    }
  }
})()

// 退出登录
function doLogOff(){
  user = null
  removeLocalUser()
}
/**
 * 
 * @param {*} loginData (可以是{loginValue, password, requestType, userType}对象 或 不发，此时用token验证)
 * @returns 
 */

// 登录
function doLogin(loginData = null){
  loginRequest(loginData).then(res => {
    user = res
    setLocalUser(user)
  }, err => {
    user = null
  })
}

// 判断是否用户登录了
function isLogin() {
  return user == null ? false : true
 }

export {user, doLogOff, doLogin, isLogin}










