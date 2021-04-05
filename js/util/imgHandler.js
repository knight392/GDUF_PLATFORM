function getImgBase64(img){
  const reader = new FileReader(); // 用来展示
  //因为每次表签设置了单文件读取，所以是file[0]
  reader.readAsDataURL(img); //转成base64
  reader.fileName = img.name;
  return reader;
}

function isImage(fileName) {
  if (!fileName.match(/.jpg|.gif|.png|.jpeg|.bmp/i)) {　　 //判断上传文件格式
    return false;
  }
  return true;
}
export {getImgBase64, isImage}