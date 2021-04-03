import {getToken, loginRequest} from './tools'
// user为null,表示没有登录
let user = null;

// 每次加载页面都看看有没有token,可自动登录
(function(){
  const token = getToken();
  if(token != null && token != ''){
    try{
      user =  doLogin(token)
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
 * @param {*} loginData (可是{loginValue, password, requestType, userType}对象，也可以是一个token)
 * @returns 
 */
function doLogin(loginData){
  loginRequest(loginData).then(res => {
    user = res
  }, err => {
    user = null
  })
}

export {user, doLogOff, doLogin}










