import { getImgBase64, isImage } from '../../../util/imgHandler.js';
import { getTime, getImgsRemoteURL, valueIsEmpty, submitRequest } from '../lostFoundCommonUtil.js';
import sendFile from '../fileHandler.js';
import request from '../../../util/request.js';
import { baseHttpURL } from '../../../common/baseRequestInfo.js';
let lostLocation = "";
let objectType = "";
let objectDetailType = "";
let sendingImg = false;

//  获取丢失地点
function getLocation_lost() {
  lostLocation = $(".modal_bg_lost .lostArea .value .text").html() + "" + $(".modal_bg_lost .lostArea .value .areaDetail").val();
}

//插入图片：现在就只能插入到输入框的最后
function readFile_lost() {
  if (isImage(this.file[0].name)) {　　 //判断上传文件格式
    return displayTipPane("图片格式有误！");
  }
  const formdata = new FormData();
  formdata.append(0, this.files[0]); // formdata 的属性
  const reader = getImgBase64(this.files[0])
  reader.onload = function (e) {
    let imgMsg = {
      name: this.fileName, //获取文件名
      base64: this.result //reader.readAsDataURL方法执行完后，base64数据储存在reader.result里
    }
    let newImage = template("templateAddImage", imgMsg);
    let imgObj = $(newImage);
    $(".imgPrevLoad img").attr("src", this.result);
    isImgLoad(function () {
      imgObj.attr("prevLoadHeight", parseInt($(".imgPrevLoad img").height()));
    }, ".imgPrevLoad img")
    //把新的图片添加到编辑区
    $(".modal_bg_lost .imgBox").append(imgObj);
    sendImage_lost(formdata, imgObj); //发送图片
  }
  // }
}

//发送图片
function sendImage_lost(formdata, imgObj) { //imgObj是jq对象
  sendingImg = true;
  sendFile(formdata).then(res => {
    imgObj.attr("remoteurl", res);//把远程url地址写在remoteurl上
    sendingImg = false;
  }, err => {
    imgObj.remove();
    sendingImg = false;
    displayTipPane("图片上传失败！已自动删除！")
  })
}

// 根据物品名称进行拾品展示
function searchFound(content) {
  request(baseHttpURL + '/Servlet/LostAndFoundExploreServlet', {
    method: 'get',
    body: {
      requestType: 'get',
      type: 'found',
      exploreContent: content
    }
  }).then(res => {
    let dataList = res.dataList;
    $(".modal_bg_lost .search_display").fadeOut();
    if (dataList.length != 0 && dataList != null && dataList != undefined) {
      $(".modal_bg_lost .search_display ul").html("");//清除之前记录
      $(".modal_bg_lost .search_display").fadeIn();
      displayFound(dataList)
    }
  })
}

// 加载更多没写
function displayFound(dataList) {
  // 现在是先全部有图片
  // let reg = /(..\/)/
  for (let i = 0; i < dataList.length; i++) {
    let data = {
      "id": dataList[i].id,
      "foundObjectName": dataList[i].foundObjectName,
      "objectDetailType": dataList[i].objectDetailType,
      "foundDescribe": dataList[i].foundDescribe
    }
    if (dataList[i].imgs.length != 0) {
      let url = dataList[i].imgs[0];
      // url = url.replace(reg.exec(url)[0],"../");
      data["img"] = url;
    }
    let item = template("templateFoundItem", data);
    $(".modal_bg_lost .search_display ul").append(item);
  }
  $(".modal_bg_lost .search_display ul").find("em").removeAttr("style");
  $(".modal_bg_lost .search_display ul").find("em").css("font-weight", "700")
}

function submit_lost() {
  // 判空
  //物品名称
  if (!valueIsEmpty($('.modal_bg_lost .objName .value').val(), "把物品名称填上吧~") &&
    !valueIsEmpty($('.modal_bg_lost .objClass .value .text').html(), "物品类别还没选哦~") &&
    !valueIsEmpty($('.modal_bg_lost .objDetail .value_box').val(), "把物品描述清楚一点吧~") &&
    !valueIsEmpty($(".modal_bg_lost .contact .value").val(), "没有联系方式，拾主怎么联系你呢？")) {

    let data = {
      "requestType": "post",
      "type": "lost",
      "contact": $(".modal_bg_lost .contact .value").val(),
      // "authorMarkNumber": $.cookie("markNumber"),
      "objectDetailType": objectDetailType,
      "objectType": objectType,
      "lostDescribe": $('.modal_bg_lost .objDetail .value_box').val(),
      "lostObjectName": $('.modal_bg_lost .objName .value').val(),
    };
    const lostTime = getTime('.modal_bg_lost');

    if (lostTime != "") {
      data["lostTime"] = lostTime;
    }
    getLocation_lost();
    if (lostLocation != "") {
      data["lostLocation"] = lostLocation;
    }
    const imgs = getImgsRemoteURL('.modal_bg_lost');
    if (imgs.length != 0) {
      data["imgs"] = imgs;
      let imgsArr = $(".modal_bg_lost .imgBox").children();
      data["imgHeight"] = $(imgsArr[0]).attr("prevLoadHeight");

    }
    submitRequest(data).then(res => {
      displayTipPane("发布成功！");
      $(".modal_bg_lost").fadeOut();
      clearModalLost();
    }, err => {
      displayTipPane("发布失败！");
    })
  }
}

function clearModalLost() {
  //物品名称
  $('.modal_bg_lost .objName .value').val("");
  //类型
  $('.modal_bg_lost .objClass .value .text').html("");
  objectType = "";
  objectDetailType = "";

  //时间
  $(".modal_bg_lost .lostTime  .time_display").css("display", "none");
  //地点
  $(".modal_bg_lost .lostArea .text").html("");
  $(".modal_bg_lost .lostArea .areaDetail").val("");
  $(".modal_bg_lost .lostArea .areaDetail").css("display", "none");
  lostLocation = "";

  // 详情
  $('.modal_bg_lost .objDetail .value_box').val("");
  //图片
  $(".modal_bg_lost .addPic .imgBox").html("");
  //联系方式
  $(".modal_bg_lost .contact .value").val("");
  //奖励
  $(".modal_bg_lost .award .value_box").val("");
}
export { readFile_lost, submit_lost, searchFound }