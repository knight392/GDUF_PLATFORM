import request from '../../util/request.js'
import {baseHttpURL} from '../baseRequestInfo.js'
import cookieUtil from '../../util/cookieUtil.js'
// 对返回的用户对象数据进行过滤
function filter(obj) {
  let { userType, messagePojo } = obj;
  let { markNumber, email, face, college, sex, userName, area, graduatedUniversity, degree } = messagePojo;
  const user = { userType, markNumber, email, face, college, sex, userName, area, graduatedUniversity, degree };
  return user;
}

/**
 * 
 * @param {*} loginData ({loginValue, password, requestType, userType}对象, 也可以什么也不发，这时hui)
 * @returns 
 */
function loginRequest(loginData){
  return new Promise((resolve, reject) => {
    request(baseHttpURL+'', {
      method: 'get',
      body: loginData ? JSON.stringify(loginData) : ''
    }).then(res => {
      // 同时会服务器返送一个名为token的cookie到客户端中，客户端会自动保存，并且在每次的http请求中都会发送给服务器
      resolve(filter(res))
    }, err => {
      resolve(null)
    })
  })
}

// 获取token
/**
 * 
 * @returns null | String
 */
function getToken() {
  
 return  cookieUtil.get('token')
}

export {loginRequest, getToken}