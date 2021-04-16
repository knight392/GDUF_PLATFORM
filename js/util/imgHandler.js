/**
 * 读取本地文件完base64的uri格式，一般用来做图片预览
 * @param {file} img 
 * @returns {Object} reader
 */
function getImgBase64(img) {
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
    if (!fileName.match(/.jpg|.gif|.png|.jpeg|.bmp|webp|svg/i)) {　　 //判断上传文件格式
        return false;
    }
    return true;
}

/**
 * 判断是否是视频
 * @param {*} fileName 
 * @returns {Boolean}
 */
function isVideo(fileName) {
    if (!fileName.match(/.mp4|.avi|.rmvb|.rm|.flv|.3gp|.mov/i)) {　　 //判断上传文件格式
        return false;
    }
    return true;
}


export { getImgBase64, isImage, isVideo }