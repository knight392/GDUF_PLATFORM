import request from '../../util/request'
import {baseHttpURL} from '../baseRequestInfo'
// 对返回的用户对象数据进行过滤
function filter(obj) {
  let { userType, messagePojo } = obj;
  let { markNumber, email, face, college, sex, userName, area, graduatedUniversity, degree } = messagePojo;
  const user = { userType, markNumber, email, face, college, sex, userName, area, graduatedUniversity, degree };
  return user;
}

/**
 * 
 * @param {*} loginData (可是{loginValue, password, requestType, userType}对象，也可以是一个token)
 * @returns 
 */
function loginRequest(loginData){
  return new Promise((resolve, reject) => {
    request(baseHttpURL+'', {
      method: 'get',
      body: JSON.stringify(loginData)
    }).then(res => {
      // 应该返回一个token
      resolve(filter(res))
    }, err => {
      resolve(null)
    })
  })
}

function getToken() {
  try{
    return $.cookie('token')
  }catch(e){
    console.log(e);
    return null;
  }
}

export {loginRequest, getToken}