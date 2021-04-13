
import {baseHttpURL} from '../../common/baseRequestInfo.js'

let url = baseHttpURL + '/Servlet/ReceiveFileServlet'
//文件上传
/**
 * 
 * @param {*} formdata 
 * @returns (promise) res里保存的是文件上传后返回的远程地址
 */
export default function sendFile(formdata) { //imgObj是jq对象
  return new Promise((resolve, reject) => {
    request(formdata).then(res => {
      // 返回远程的url
      resolve(res.message)
    }, err => {
      reject(err)
    })
  })
}
 
// formdata特殊请求
function request(data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type:'post',
      data,
      dataType: 'json',
      processData: false, //用FormData传fd时需有这两项
      contentType: false,
      success(res) {
        resolve(res)
      },
      error(e) {
        reject(e)
      }
    })
  })
}