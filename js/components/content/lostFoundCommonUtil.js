import {displayTipPane_warn} from './tipPane.js'
// 获取时间
/**
 * 
 * @param {*} paneClassName 
 * @returns {String} time
 */
function getTime(paneClassName) {
  if ($(`${paneClassName} .yearNum`).html().trim() != "") {
    let month = $(`${paneClassName} .monthNum`).html();
    let day = $(`${paneClassName} .dayNum`).html();
    month = month.length > 1 ? month : "0" + month;
    day = day.length > 1 ? day : "0" + day;
    return `${$(`${paneClassName} .yearNum`).html()}-${month}-${day}`;
  }
  return '';
}

// 加载图片的远程URL
/**
 * 
 * @param {*} paneClassName 
 * @returns {Array} imgsRemoteURL
 */
function getImgsRemoteURL(paneClassName) {
  let imgsArr = $(`${paneClassName} .imgBox`).children();
  let imgs = [];
  for (let i = 0; i < imgsArr.length; i++) {
    imgs[i] = $(imgsArr[i]).attr("remoteurl")
  }
  return imgs;
}

// 判断值是否为空
function valueIsEmpty(value, tip) {
  if (value == "" || value == null || value == undefined) {
    displayTipPane_warn(tip);
    return true;
  }
  return false;
}

// 提交请求
function submitRequest(data) {
  return new Promise((resolve, reject) => {
    request(baseHttpURL + '/Servlet/LostAndFoundServlet', {
      method: 'post',
      body: data
    }).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}
export { getTime, getImgsRemoteURL, valueIsEmpty, submitRequest }