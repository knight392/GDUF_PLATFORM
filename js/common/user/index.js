import { getLocalUser, setLocalUser, removeLocalUser, loginRequest } from './tools.js'
import { createWebSocket, closeWebSocket } from '../../components/content/inform/listner/index.js'
import { baseWsURL } from '../baseRequestInfo.js'
import {dealWithUserPane} from '../../components/content/logOn/tools.js'
// user为null,表示没有登录
/**
 *  { userType, markNumber, email, face, college, sex, userName, area, graduatedUniversity, degree, major }
 */
let user = null;

// 每次加载页面都看看有没有token,可自动登录
(function() {
    user = getLocalUser();
    if (user != null) {
        try {
          console.log('本地有用户数据',user);
            // createWebSocket(baseWsURL)
        } catch (e) {
            console.log(e);
            user = null;
        }
    }
    dealWithUserPane();
})()

// 退出登录
function doLogOff() {
    user = null
    closeWebSocket()
    removeLocalUser()
}
/**
 * 
 * @param {*} loginData (可以是{loginValue, password, requestType, userType}对象 或 不发，此时用token验证)
 * @returns 
 */

// 登录
function doLogin(loginData) {
    return new Promise((resolve, reject) => {
        loginRequest(loginData).then(res => {
            user = res
            // createWebSocket(baseWsURL)
            setLocalUser(user)
            resolve(true)
        }, err => {
            user = null
            resolve(false)
        })
    })

}

// 判断是否用户登录了
function isLogin() {
    console.log(user);
    return user == null ? false : true
}

export { user, doLogOff, doLogin, isLogin }