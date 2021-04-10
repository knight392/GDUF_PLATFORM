import request from "../../util/request.js";
import {baseHttpURL} from '../../common/baseRequestInfo.js'
// 敏感词处理函数
/**
 * 
 * @param {String} content 
 * @returns {Object} 审核失败 {isErr: false, message: res.message} | 审核成功 {res[0]} | 发生错误 {isErr: true, message: err}
 */
export default function SensitiveWordHandler(content) {
  return new Promise((resolve, reject) => {
    request(baseHttpURL + '/Servlet/SensitiveWordServlet', {
      method: 'post',
      body: {
        testArr: [content]
      }
    }).then(res => {
      // 被禁止
      if(res.statusCode == 500){
        reject({isErr: false, message: res.message})
      }else{
        // 审核通过
        resolve(res[0])
      }
    }, err => {
      reject({isErr: true, message: err})
    })
  })
}