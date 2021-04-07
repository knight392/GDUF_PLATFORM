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

export {getTime, getImgsRemoteURL}