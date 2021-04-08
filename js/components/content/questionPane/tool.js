import request from '../../../util/request.js'
import { baseHttpURL } from '../../../common/baseRequestInfo.js'
import displayTipPane from '../tipPane.js'
import sendFile from '../fileHandler.js'
import {getImgBase64, isImage } from '../../../util/imgHandler.js'
import SensitiveWordHandler from '../sensitiveWordHandler.js'
let sendingImg = false;

function textInputHandler() {
  let nowNum = $(this).val().length;
  $(this).siblings("span").find(".nowNum").text(nowNum);
  let maxNum = $(this).siblings("span").find(".maxNum").text();
  if (nowNum > maxNum) {
    $(this).css("title", "字数不能超过" + maxNum + "个");
    $(this).siblings("span").find(".nowNum").text(maxNum);
    $(this).val($(this).val().substring(0, maxNum));
    $(this).css("readonly", "readonly");
  }
}

//发送请求获取关键词，拿到关键词后把他们添加到标签栏上
function getKeyword() {
  request(baseHttpURL + '/Servlet/AnalyzeKeyWordServlet', {
    method: 'get',
    body: {
      requestType: "get",
      keyWord: $(this).val()
    }
  }).then(res => {
    displayLabels(res); //返回的列表
  })
}

// 展示自动生成的多个标签
function displayLabels(labels) {
  $('.quizModal_bg_askQuestion .label .nodeBoard').html("");
  for (let i = 0; i < labels.length && i < 5; i++) {
    $('.quizModal_bg_askQuestion .label .nodeBoard').append('<span><div class="text">' + labels[i] + '</div><i class="removeLabel">&times;</i></span>');
  }
  // rebindLabel.call($(this));
}

// 对父容器使用事件委派来处理删除item
function BindrRmoveItemEvent(containerId, btnClassName, handler) {
  $(containerId).on('click', function(e) {
    if (e.target.className = btnClassName) {
      handler.call(e.target)
    }
  } )
}

// // 应该可以是使用事件委派来解决
// function rebindLabel() {
//   //#region 鼠标悬停在标签 上 背景颜色改变 且出现删除按钮
//   $(".nodeBoard>span").on({
//     mouseover: function () {
//       $(this).css("backgroundColor", "rgba(0, 0, 0, 0.1)");
//       $(this).find("i").show();
//     },
//     mouseout: function () {
//       $(this).css("backgroundColor", "#fff");
//       $(this).find("i").hide();
//     }
//   })
//   //#region 标签删除 添加
//   $(".removeLabel").on("click", function () {
//     // console.log("删除标签");
//     // label_count--;
//     // console.log(label_count);
//     $(this).parent().hide(300);
//   })
// }

// 手动添加标签
function addLableManually() {
  //添加标签
  let text = $(".quizModal_bg_askQuestion .addLabel input").val().trim();
  if (text != '' && text != null && text != undefined) {
    $('.quizModal_bg_askQuestion .label .nodeBoard').append('<span class="labelItem"><div class="text">' + text + '</div><i class="removeLabel">&times;</i></span>')
  } else {
    displayTipPane("标签不能为空！");
  }
  $(".quizModal_bg_askQuestion .addLabel input").val("");
}

// 添加图片
function addImage() {
  if (sendingImg) {
    displayTipPane("有图片还在上传中...");
    return;
  }
  if (!isImage(this.files[0].name)) {
    displayTipPane("图片格式有误！");
    return;
  }
  const btn = this;
  const formdata = new FormData();
  formdata.append(0, this.files[0]);
  const reader = getImgBase64(this.files[0]);
  reader.onload = function() {
    let imgObj = $(`
    <div class='picture'>
      <i class='removePicture'>&times;</i>
      <img src='${this.result}'>
    </div>`)
    //在.insertPicture中添加.picture
    $(btn).parents(".insertPicture").find(".picture_containner").append(imgObj);
    sendImage(formdata, imgObj); //发送图片
  }
}


//发送图片
function sendImage(formdata, imgObj) { //imgObj是jq对象
  sendingImg = true;
  sendFile(formdata).then(res => {
    imgObj.attr("remoteURL", res);
    sendingImg = false;
  }, err => {
    imgObj.remove();
    sendingImg = false;
    displayTipPane("上传失败！已自动删除原图片！");
  })
}

// 获取发送内容Item
function getContentItem(order, type, content) {
  return {
    "contentOrder": order,
    "contentType": type,
    "contentMain": content
  }
}
//发送提问
function sendQuestion() {
  if (sendingImg) {
    displayTipPane("有图片正在上传中！");
    return;
  }
  const data = getSubmitData();
  if(data == null) {
    return;
  }
  //判断敏感词，审核通过执行发送
  SensitiveWordHandler(data.textContent).then(res => {
    if (res.isPass) {
      data.contents[0].contentMain = res.content;
      submitQuestionRequst(
        {"requestType": "post",
          "title": data.title,
          "tag": data.labels,
          "questionType": data.type,
          // "authorMarkNumber": $.cookie("markNumber"),
          "contents": data.contents,
          "anonymity": data.anonymity}
      )
    } else {
      displayTipPane("内容" + res.message + "请修改后再发送！");
    }
  }, err => {
    console.log(err);
  })
}

function submitQuestionRequst(data) {
  //获取内容
  //发送内容
  request(baseHttpURL + '/Servlet/QuestionServlet', {
    method: 'post',
    body: data
  }).then(res => {
    displayTipPane("发布成功！");
    $(".quizModal_bg_askQuestion").fadeOut();
    clearPane();
  }, err => {
    displayTipPane("遇到了未知原因，发布失败！");
  })
}

// 获取提交的数据

function getSubmitData() {
  let title = $(".quizModal_bg_askQuestion .mainQuestion textarea").val();
  let type = $(".quizModal_bg_askQuestion .questionType .cur_val").attr("value");
  //判空
  if (title == "" || title == null || title == undefined) {
    displayTipPane("问题标题不能为空!");
    return null;
  }
  let textContent = $(".quizModal_bg_askQuestion .questionNote textarea").val();
  if (textContent == "" || textContent == null || textContent == undefined) {
    displayTipPane("问题不能备注为空!");
    return null;
  }
  let contents = [];
  let contents_order = 1;
  //添加文字
  contents[0] = getContentItem(1, "text", textContent);
  //添加图片
  let imgArr = $(".quizModal_bg_askQuestion .insertPicture .picture_containner").children();
  for (let i = 0; i < imgArr.length; i++) {
    let url = $(imgArr[i]).find("img").attr("remoteurl");
    contents[i + 1] = getContentItem(++contents_order, "img", url);
  }

  let labels = [];
  let oLabels = $(".quizModal_bg_askQuestion .nodeBoard").children();
  if (oLabels.length == 0) {
    displayTipPane("请至少选择一个标签");
    return null;
  }
  for (let i = 0; i < oLabels.length; i++) {
    labels[i] = $(oLabels[i]).find(".text").html();
  }

  if (type == "null") {
    displayTipPane("请选择文章类型！");
    return null;
  }
  let anonymity = $(".quizModal_bg_askQuestion .anonymity").attr("anonymity") == "true" ? true : false;
  return {
    title,
    textContent,
    contents,
    labels,
    type,
    anonymity
  }
}

// 清空面板输入内容
function clearPane() {
  //清空title,detail
  $(".quizModal_bg_askQuestion .mainQuestion textarea").val("");
  $(".quizModal_bg_askQuestion .questionNote textarea").val("");
  //清空图片
  $(".quizModal_bg_askQuestion .picture_containner").html("");
  $(".quizModal_bg_askQuestion .insertPicture .file").css("display", "block");

  //清空标签
  $(".quizModal_bg_askQuestion .nodeBoard").html("");
  //清空自行输入标签
  $(".quizModal_bg_askQuestion .addLabel input").val("");

  //清空计数器
  $(".quizModal_bg_askQuestion .nowNum").html("0");


  //清除问题类型
  $(".quizModal_bg_askQuestion .questionType .cur_val").attr("value", "null");

  $(".quizModal_bg_askQuestion .questionType .cur_val").html("请选文章类型");

  //清除匿名
  $(".quizModal_bg_askQuestion .anonymity").attr("anonymity", 'false');
  $(".quizModal_bg_askQuestion .anonymity").css("display", "none");

}



export { textInputHandler, addImage, addLableManually, getKeyword, sendQuestion, BindrRmoveItemEvent}