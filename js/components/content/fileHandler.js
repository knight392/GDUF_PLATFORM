//发送图片
export default function sendFile(url ,formdata) { //imgObj是jq对象
  return new Promise((resolve, reject) => {
    request(url, {
      method:'post',
      body:formdata
    }).then(res => {
      // 返回远程的url
      resolve(res.message)
    }, err => {
      reject(err)
    })
  })
}
