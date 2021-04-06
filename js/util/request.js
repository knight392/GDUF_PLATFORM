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
export default function(url, config = {}, dataType = 'json') {
  // return fetch(url, config).then(response => response[type]())
  // 因为fetch不会自动携带cookie，还是用$.ajax吧
  let type,data
  try{
    type = config ? config.method : 'get'
    data = config ? config.body : null
    data = type == 'get' ? data : JSON.stringify(data)
  }catch(e) {
    console.log(e)
    return
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type,
      data,
      dataType,
      success(res) {
        resolve(res)
      },
      error(e) {
        reject(e)
      }
    })
  })
}