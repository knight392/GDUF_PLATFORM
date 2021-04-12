import { getLocalUser, setLocalUser, removeLocalUser, loginRequest } from './tools.js'
import { createWebSocket, closeWebSocket } from '../../components/content/inform/index.js'
import { baseWsURL } from '../baseRequestInfo.js'
// user为null,表示没有登录
/**
 *  { userType, markNumber, email, face, college, sex, userName, area, graduatedUniversity, degree }
 */
let user = null;

// 每次加载页面都看看有没有token,可自动登录
(function() {
    const user = getLocalUser();
    if (user != null) {
        try {
            // 有token就发送一个token的cookie
            createWebSocket(baseWsURL)
        } catch (e) {
            console.log(e);
            user = null;
        }
    }
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
            createWebSocket(baseWsURL)
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
    return user == null ? false : true
}

export { user, doLogOff, doLogin, isLogin }