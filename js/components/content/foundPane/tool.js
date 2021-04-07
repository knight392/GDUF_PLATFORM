// 物品类型
import { baseHttpURL } from '../../../common/baseRequestInfo.js';
import { isImage, getImgBase64 } from '../../../util/imgHandler.js'
import request from '../../../util/request.js';
import sendFile from '../fileHandler.js';
import { getTime, getImgsRemoteURL } from '../lostFoundCommonUtil.js'
import displayTipPane from '../tipPane.js'

let sendingImg = false; // 判断是否正在发送图片，如果是就不能点击发表文章
let objectDetailType = '';
let objectType = '';


// 选择物品类型
function selectObjectType() {
  $(this).parents(".objClassPane").stop().fadeIn(200);
  $(this).parents(".value").find(".text").html($(this).html())
  // 物品分类
  objectDetailType = $(this).html();
  objectType = $(this).parents(".row_objClass").find(".title_row").html();
}



//  获得丢失地点
function getLocation_found() {
  return $(".modal_bg_found .foundArea .value .text").html() + "" + $(".modal_bg_found .foundArea .value .areaDetail").val();
}


function readFile_found() {
  if (!isImage(this.files[0].name)) {　　 //判断上传文件格式
    return displayTipPane("图片格式有误！");
  }
  const reader = getImgBase64(this.files[0]);
  const formdata = new FormData(); // 用来发送数据
  formdata.append(0, this.files[0]); // formdata 的属性
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
    // console.log( $(this).parents(".addPic").find(".imgBox"));
    $(".modal_bg_found .imgBox").append(imgObj);
    sendImage_found(formdata, imgObj); //发送图片
  }
  // }
}


//发送图片
function sendImage_found(formdata, imgObj) { //imgObj是jq对象
  sendingImg = true;
  sendFile(formdata).then(res => {
    imgObj.attr("remoteurl", data.message);//把远程url地址写在remoteurl上
    sendingImg = false;
  }, err => {
    imgObj.remove();
    sendingImg = false;
    displayTipPane("图片上传失败！已自动删除！")
  })
}

// 一键发布
function submite_found() {
  // 判空
  //物品名称
  // if($('.modal_bg_found .objName .value').val())

  if (!valueIsEmpty($('.modal_bg_found .objName .value').val(), "把物品名称填上吧~") &&
    !valueIsEmpty($('.modal_bg_found .objClass .value .text').html(), "物品类别还没选哦~") &&
    !valueIsEmpty($('.modal_bg_found .objDetail .value_box').val(), "把物品描述清楚一点吧~") &&
    !valueIsEmpty($(".modal_bg_found .contact .value").val(), "填上联系方式更方便失主联系您噢~")) {

    let data = {
      "requestType": "post",
      "type": "found",
      "contact": $(".modal_bg_found .contact .value").val(),
      // "authorMarkNumber": $.cookie("markNumber"),
      "objectDetailType": objectDetailType,
      "objectType": objectType,
      "foundDescribe": $('.modal_bg_found .objDetail .value_box').val(),
      "foundObjectName": $('.modal_bg_found .objName .value').val(),
    };
    const foundTime = getTime('.modal_bg_found');
    if (foundTime != "") {
      data["foundTime"] = foundTime;
    }
    getLocation_found();
    if (foundLocation != "") {
      data["foundLocation"] = foundLocation;
    }
    const imgs = getImgsRemoteURL('.modal_bg_found');
    if (imgs.length != 0) {
      data["imgs"] = imgs;
      let imgsArr = $(".modal_bg_found .imgBox").children();
      data["imgHeight"] = $(imgsArr[0]).attr("prevLoadHeight");
    }
    request(baseHttpURL + '/Servlet/LostAndFoundServlet', {
      method: 'post',
      body: data
    }).then(res => {
      displayTipPane("发布成功！");
      $(".modal_bg_found").fadeOut();
      clearModalFound();
    }, err => {
      displayTipPane("发布失败！");
    })
  }
}

// 清空
function clearModalFound() {
  //物品名称
  $('.modal_bg_found .objName .value').val("");
  //类型
  $('.modal_bg_found .objClass .value .text').html("");
  objectType = "";
  objectDetailType = "";
  //时间
  $(".modal_bg_found .foundTime  .time_display").css("display", "none");
  //地点
  $(".modal_bg_found .foundArea .text").html("");
  $(".modal_bg_found .foundArea .areaDetail").val("");
  $(".modal_bg_found .foundArea .areaDetail").css("display", "none");
  foundLocation = "";

  // 详情
  $('.modal_bg_found .objDetail .value_box').val("");
  //图片
  $(".modal_bg_found .addPic .imgBox").html("");
  //联系方式
  $(".modal_bg_found .contact .value").val("");
  //奖励
  $(".modal_bg_found .award .value_box").val("");
}

export { selectObjectType, submite_found, readFile_found}