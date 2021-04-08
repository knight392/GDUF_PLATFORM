/**
 * 读取本地文件完base64的uri格式，一般用来做图片预览
 * @param {file} img 
 * @returns {Object} reader
 */
function getImgBase64(img){
  const reader = new FileReader(); // 用来展示
  reader.readAsDataURL(img); //转成base64
  reader.fileName = img.name;
  return reader;
}

/**
 * 判断是否是图片
 * @param {*} fileName 
 * @returns {Boolean}
 */
function isImage(fileName) {
  if (!fileName.match(/.jpg|.gif|.png|.jpeg|.bmp/i)) {　　 //判断上传文件格式
    return false;
  }
  return true;
}
export {getImgBase64, isImage}