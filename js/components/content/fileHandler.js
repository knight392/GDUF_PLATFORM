import { baseHttpURL } from '../../common/baseRequestInfo.js'
import request from '../../util/request.js'

let url = baseHttpURL + '/Servlet/ReceiveFileServlet'
    //文件上传
    /**
     * 
     * @param {*} formdata 
     * @returns (promise) res里保存的是文件上传后返回的远程地址
     */
export default function sendFile(formdata) { //imgObj是jq对象
    return new Promise((resolve, reject) => {
        request(url, {
            method: 'post',
            body: formdata
        }).then(res => {
            // 返回远程的url
            resolve(res.message)
        }, err => {
            reject(err)
        })
    }, 'string')
}