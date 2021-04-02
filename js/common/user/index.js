export {doLogin} from './tools'
import {getToken} from './tools'
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
}

export {user, doLogOff}










