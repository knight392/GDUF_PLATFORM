/**
 * 
 * @param {*} url 
 * @param {*} config 参数对象 {
 *    method: get | post | put | delete
 *    body: JSON.stringfy() | String | formData
 *    header: Header
 * }
 * @param {*} type  json | text 接收的数据格式
 * @returns promise
 * 
 * 
 */
export default function(url, config = {}, type = 'json') {
  return fetch(url, config).then(response => response[type]())
}