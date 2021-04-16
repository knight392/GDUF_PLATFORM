import { baseHttpURL } from '../../common/baseRequestInfo.js';
import request from '../../util/request.js';
import { displayTipPane_err, displayTipPane_success, displayTipPane_warn, tipInfo } from '../../components/content/tipPane.js'
import {agreeRequest, sendInfo} from '../questionPage/tools.js';
import { isLogin, user } from '../../common/user/index.js';
import inputTextFilter from '../../components/content/inputTextFilter.js';
import sendFile from '../../components/content/fileHandler.js';
import { getContentItem } from '../../components/content/questionPane/tool.js'
import { getImgBase64, isImage, isVideo } from '../../util/imgHandler.js';
let sendingImgVideo = false;

// 发送图片 视频
function sendImgVideo(formdata, obj) { //imgObj是jq对象
  sendingImgVideo = true;
  sendFile(formdata).then(res => {
    obj.attr("remoteURL", res);
    sendingImgVideo = false;
  }, err => {
    console.log(err);
    obj.remove();
    sendingImgVideo = false;
    displayTipPane_err("文件上传失败了哦~");
  })
}

// 添加视频/img  删除
export function insertImgVideo(type) {
  const that = $(this);
  if (sendingImgVideo) {
    displayTipPane_warn("有图片/视频正在上传哦~");
    return;
  }
  if (type == 'img' && !isImage(this.files[0].name)) {
    displayTipPane_warn(tipInfo.img.format_warn);
    return;
  }
  if (type == 'video' && !isVideo(this.files[0].name)) {
    displayTipPane_warn(tipInfo.video.format_warn);
    return;
  }
  const formdata = new FormData();
  formdata.append(0, this.files[0]);
  const reader = getImgBase64(this.files[0]);
  reader.onload = function () {
    let src = this.result;

    if (type === 'img') {
      let div = $("<div class='develimgY'><b class='removeimg removeImgVideo' title='删除'>&times;</b></div>");
      let img = $('<img>');
      $(img).attr("src", src);
      $(div).prepend(img);
      that.parents(".addfileY").before(div);
      if ($(".develimgY").length > 8) {
        $(this).parent().hide();
      }
      sendImgVideo(formdata, $(img)); //发送图片
    } else {
      let div = $("<div class='develVideoY'><b class='removevideo removeImgVideo' title='删除'>&times;</b></div>");
      let video = $('<video muted autoplay loop></video>');
      $(div).prepend(video);
      $(this).find(".addfileY").hide();
      $(video).attr("src", src);
      $(this).parents(".addfileY").before(div);
      $(video).css({
        'width': $(this).find('video').css('width') + 'px',
        'margin': '0 auto'
      });
      sendImgVideo(formdata, $(video)); //发送视频
    }
    //×出现与消失
    $(".develimgY").on({
      mouseover: function () {
        console.log("movein");
        $(this).find(".removeImgVideo").stop().show(200);
      },
      mouseout: function () {
        console.log("moveout");
        $(this).find(".removeImgVideo").stop().hide(200);
      }
    })

    //删除图片 
    $(".removeimg").on({
      click: function () {
        if ($(".develimgY").length <= 9) {
          $('.addpicY').find(".addfileY").show();
        }
        $(this).parent().remove();
      }
    })

    //删除视频
    $(".removevideo").on({
      click: function () {
        $(this).parents('.addvideo').find(".addfileY").show();

        $(this).parent().remove();
      }
    })
  }


}
// 发布信息
export function sendDevel() {
  if (!isLogin()) {
    displayTipPane_warn(tipInfo.login.no_login);
    return;
  }
  if (sendingImgVideo) {
    displayTipPane_warn("有图片/视频正在上传哦~");
    return;
  }

  let title = $(".issuePersonalDY textarea").val();

  //判空
  if (title == "" || title == null || title == undefined) {
    displayTipPane_warn('文章内容不能为空哦~');
    return;
  }

  let contents = [];
  let contents_order = 0;


  if ($('.develimgY').length > 0) {
    const imgArr = $(".issuePersonalDY .addpicY .addpicSon .develimgY img");
    for (let i = 0; i < imgArr.length; i++) {
      const url = $(imgArr[i]).attr("remoteurl");
      contents[i] = getContentItem(++contents_order, "img", url);
    }
  } else if ($('.develvideoY').length > 0) {
    const videoArr = $(".issuePersonalDY .addvideoY .addvideoSon .develvideoY video");
    for (let i = 0; i < videoArr.length; i++) {
      let url = $(videoArr[i]).attr("remoteurl");
      contents[0] = getContentItem(++contents_order, "video", url);
    }
  }

  //判断敏感词
  inputTextFilter(title).then(res => {
    title = res;
    sendD();
  }, err => {
    if (err.isErr) {
      displayTipPane_err(tipInfo.submit.err);
    } else {
      displayTipPane_err(`内容：${err.message}，请修改后再重新提交！`);
    }
  })

  //获取内容 发送内容
  function sendD() {

    request(baseHttpURL + '/Servlet/QuestionServlet', {
      method: "post",
      body: {
        requestType: "post",
        title,
        questionType: "Dynamic",
        authorMarkNumber: user.markNumber,
        contents,
      }
    }).then(res => {
      displayTipPane_success(tipInfo.submit.succees);
      //清空title,detail
      $(".issuePersonalDY textarea").val("");

      //清空图片
      $(".addpicY .develimgY").remove();
      $(".addpicY .addfileY").show();
      $(".addvideoY .develvideoY").remove();
      $(".addvideoY .addfileY").show();
    }, err => {
      displayTipPane_err(tipInfo.submit.err);
      console.log(err);
    })
  }

}

// 文章点赞
export function agreeQuestion() {
  console.log('点赞');
  //当前点击状态
  if (!isLogin()) {
    displayTipPane_warn(tipInfo.login.no_login);
    return;
  }
  if ($(this).attr("changing") == "true") {
    displayTipPane_warn(tipInfo.submit.tooFrequent)
    return;
  }
  $(this).attr("changing", "true");
  let status = $(this).parents(".like_btn").attr("status");
  let obj = $(this);
  let questionId = $(this).parents('.queY').data('queId');
  console.log(questionId);
  if (status == "agree") { //再次点击为取消点赞
    agreeRequest({
      requestType: "delete",
      agreeType: "question",
      markNumber: user.markNumber,
      questionId 
    }).then(res => {
      obj.parents(".like_btn").attr("status", "no_agree");
      obj.parents(".like_btn").addClass("no_agree");
      obj.parents(".like_btn").removeClass("agree");
      obj.attr("changing", "false");
      console.log('取消点赞');
    },err => console.log)
  } else if (status == "no_agree") {
    agreeRequest({
      requestType: "post",
      agreeType: "question",
      markNumber: user.markNumber,
      questionId
    }).then(res => {
      if (res.statusCode == 200) {
        obj.parents(".like_btn").attr("status", "agree");
        obj.parents(".like_btn").addClass("agree");
        obj.parents(".like_btn").removeClass("no_agree");
        obj.attr("changing", "false");
        const que = obj.parents('.queY');
        const receiverMarkNumber = que.data('markNumber');

        let data = {
          "senderMarkNumber": user.markNumber,
          "receiverMarkNumber": receiverMarkNumber,
          "content": `点赞了你的问题"${que.find('.questionTitle').html() }"`,
          // "additionContent": "额外内容 可以为空",
          "type": "inf",
          "senderName": user.userName,
          "isRead": false,
          "senderFace": user.face,
          "requestType": "post"
        }
        sendInfo(data);
        console.log('点赞');
      }
    },err => console.log)
  }else{
    console.log('不处理');
  }
}