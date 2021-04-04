import { isImage, getImgBase64 } from '../../util/imgHandler.js'
import request from '../../util/request.js'
import { baseHttpURL } from '../../common/baseRequestInfo.js'
import sendFile from '../../commponents/content/fileHandler.js'
import user from '../../common/user/index.js'
import { oAuthod, questionId } from './info.js'
let sendingImg = false; // 判断是否正在发送图片，如果是就不能点击发表文章

function fixed() {
  //侧边栏的固定
  if ($(this).scrollTop() > 500) {
    // $('.head_search_outside').addClass("head_search_outside_fixed");
    $('.sideBox_fixed').addClass("sideBox_fixed_on");
    $('.sideBox_fixed').css("right", "");
    $('.sideBox_fixed').css("left", $('.question_info_main').get(0).offsetLeft + $('.question_info_main').width() - $('.sideBox_fixed').width() + "px");

    if ($(this).height() > 900) {
      $('.sideBox_fixed .author_info_box').slideDown();
    }

  } else {
    // $('.head_search_outside').removeClass("head_search_outside_fixed");
    $('.sideBox_fixed').removeClass("sideBox_fixed_on");
    $('.sideBox_fixed').removeAttr("style");
    $('.sideBox_fixed').css("right", 0);
    $('.sideBox_fixed .author_info_box').slideUp();
  }
}

// 自定义富文本编辑器的输入文本规则
function inputText(e) {
  let ev = e || window.event;
  let key = ev.keyCode || ev.charCode;
  if (key == 13) { //回车键
    if (ev.preventDefault) {
      ev.preventDefault();
    } else {
      ev.returnValue = false;
    }
    // console.log($(this));
    let otextDiv = $('<div class="textarea edit-div" type="text" contenteditable="true" id="edit-div"></div>');
    otextDiv.keydown(function () {
      let arg = arguments;
      inputText.apply($(this), arg);
    })
    $(this).after(otextDiv);
    otextDiv.focus();
  } //删除键
  if (key == 8 && ($(this).html() == "" || $(this).html() == "<br>")) {
    if ($(this).prev().attr("id") != "begin" && $(this).prev().attr("type") != "img") {
      $(this).prev().focus();
      $(this).remove();
    }
  }
}


// 读取图片
function readFile() {
  const oinput = document.getElementById("file_input");
  if (!isImage(oinput[value])) {　　 //判断上传文件格式
    return displayTipPane("图片格式有误！");
  }
  const formdata = new FormData(); // 用来发送数据
  formdata.append(0, this.files[0]); // formdata 的属性
  const reader = getImgBase64(this.files[0]); // 用来展示
  reader.onload = function (e) {
    let newImage = template("templateImage", {
      name: this.fileName, //获取文件名
      base64: this.result //reader.readAsDataURL方法执行完后，base64数据储存在reader.result里
    });
    let imgObj = $(newImage);
    //把新的图片添加到编辑区
    $(".answerTextArea").append(imgObj);
    let otextDiv = $('<div class="textarea edit-div" type="text" contenteditable="true" id="edit-div"></div>');
    //为一行添加图片
    otextDiv.keydown(function () {
      let arg = arguments;
      inputText.apply($(this), arg);
    })
    $(".answerTextArea").append(otextDiv);
    sendImage(formdata, imgObj); //发送图片
  }
  // }
}


//发送图片
function sendImage(formdata, imgObj) { //imgObj是jq对象
  sendingImg = true;
  sendFile(baseHttpURL + "/Servlet/ReceiveFileServlet", formdata).then(url => {
    imgObj.attr("remoteurl", url);
    sendingImg = false;
  }, err => {
    sendingImg = false;
    console.log(err);
    displayTipPane("图片上传失败！已自动删除！")
  })
}

function formatAnswerContentItem(order, type, content) {
  return JSON.stringify({
    "contentOrder": order,
    "contentType": type,
    "contentMain": content
  })
}


function loadAnswerContents() {
  //遍历一遍所有的节点
  //如果是图片就把remoteURL加入到anserContent中
  //如果是文本就把文本抽出来，继续向下遍历
  //直到为空
  let order = 1;
  let children = $(".answerTextArea").children(); //返回的是直接子类元素
  let j = 0;
  let text = "";
  const answerContents = [];
  for (let i = 0; i < children.length; i++) {
    if (children[i].getAttribute("type") == "text") {
      if (children[i].innerHTML == "" || children[i].innerHTML == "<br>" || children[i].innerHTML == null || children[i].innerHTML == undefined || children[i].innerHTML == "null") {
        continue; //空格不加
      }
      text += children[i].innerHTML;
      //如果一个当前节点为最后的节点，就把文本给添加起来
      answerContents[j++] = formatAnswerContentItem(order++, "text", text);
      text = "";
    } else if (children[i].getAttribute("type") == "img") {
      answerContents[j++] = formatAnswerContentItem(order++, "img", children[i].getAttribute('remoteurl'));
    }
  }
  return answerContents;
}

function clearAnserEditor() {
  //清空内容
  $(".answerArea .answerTextArea").html('<div class="begin" id="begin"></div><div class="textarea edit-div" type="text" contenteditable="true" id="edit-div"></div>');
  $(".edit-div").keydown(function () {
    let arg = arguments;
    inputText.apply($(this), arg);
  })
}

//发送整个文本
function sendAnswer() {
  //发布文本之前把文本和图片加起来
  if (sendingImg) {
    displayTipPane("有图片正在上传中!")
    return;
  }
  //加载内容
  const answerContents = loadAnswerContents();
  if (answerContents.length === 0) {
    displayTipPane("请输入内容！");
    return;
  }
  request(baseHttpURL + "/Servlet/AnswerServlet", {
    method: 'post',
    body: JSON.stringify({
      answerContents,
      requestType: 'post',
      questionId
    })
  }).then(res => {
    if (res.statusCode == 200) {
      // 清空编辑器
      clearAnserEditor();
      //收起
      $(".answerArea .textAnswer").slideUp();
      displayTipPane("发布成功！");
      //加载最新内容
      loadMyNewAnswer(answerContents, res.id);
      //发送通知
      const data = {
        senderMarkNumber: user.markNumber,
        receiverMarkNumber: oAuthor.markNumber,
        content: '回答了你的问题"' + $(".question_info_box .questionTitle").html() + '。"',
        type: "inf",
        senderName: user.userName,
        isRead: false,
        senderFace: user.face,
        requestType: "post"
      }
      // 发送通知
      sendInfo(data);
    } else {
      displayTipPane("发布失败！");
    }
  }, err => {
    displayTipPane("发布失败！");
  })
}

// 绑定文本按钮事件
function bindAnserItemEvent(framObj) {
  framObj.find(".seeComment").on("click", function () {
    seeComment.call($(this), 1); //需要更改为动态页数
  });
  //添加评论
  framObj.find(".comment_btn").on("click", function () {
    if (!user) {
      displayTipPane("请先完成登录！");
      return;
    }
    $(this).parents(".answerItem").find(".addComment").slideDown();
  })
  //查看评论
  // oItem.attr("answerId",arr[i].contents[0]["answerId"]);

  framObj.find(".seeComment").on("click", function () {
    seeComment.call($(this), 1); //初始化加载数据
  });
  framObj.find(".loadmore").click(loadMoreComment);


  //关闭对回答进行评论块
  framObj.find(".addComment .slideUp").click(function () {
    $(this).parents(".addComment").slideUp();
  })
  framObj.find(".commentList .slideUp").click(function () {
    $(this).parents(".commentList").slideUp();
  })
  //发布评论
  framObj.find(".addComment .sendBtn").click(function () {
    sendComment.call($(this));
  })
  //查看评论

  //点赞
  framObj.find(".like_btn .icon").attr("changing", "false");
  framObj.find(".like_btn .icon").click(function () {
    if (user) {
      displayTipPane("请先完成登录！");
      return;
    }
    agreeAnswer.call($(this), $.cookie("markNumber"));
  });
}


// 根据数据数组拼接html标签
function addAnswerContentText(contentArr) {
  let contentText = "";
  for (let j = 0; j < contentArr.length; j++) {
    if (contentArr[j]["contentType"] == "text") {
      //添加p
      contentText += "<p>" + contentArr[j]["contentMain"] + "</p>";
    } else {
      //添加图片
      let src = contentArr[j]["contentMain"];
      contentText += "<img class='' src='" + src + "'/>";
    }
  }
  return contentText;
}

//把用户刚发布的回答显示出来，这个其实是要后端再发相应的
function loadMyNewAnswer(answerContents, answerId) {
  let school_info = user.userType == "学生" ? user.major : user.college;
  let framObj = $("<div class='answerItem'></div>");
  let date = new Date();

  let framData = {
    agreeCount: 0,
    commentCount: 0,
    userType: type,
    agree: "no_agree",
    time: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
    face: user.face,
    userName: user.userName,
    schoolInfo: school_info
  }
  // console.log()
  framObj.append(template("template_answerItem", framData));
  //添加answerId
  framObj.attr("answerId", answerId);
  framObj.find(".seeComment").attr("loadingAbility", "true"); //有加载数据能力
  framObj.find(".commentList").attr("nextPage", 1);
  framObj.find(".like_btn").attr("status", "no_agree");
  bindAnserItemEvent(framObj)

  //添加内容
  let contentTextArr = [];
  //转js对象
  for (let i = 0; i < answerContents.length; i++) {
    contentTextArr.push(JSON.parse(answerContents[i]));
  }
  let contentText = addAnswerContentText(contentTextArr);
  framObj.find(".contentText").append(contentText);
  $(".answerItem_List").prepend(framObj);
}

// 获取回答
function getAnswer(curPage) {
  // console.log("加载回答");
  const data = {
    requestType: "get",
    getAnswerType: "question",
    questionId, // 进入该页面后应该会有questionId
    // markNumber: $.cookie("markNumber"), // 用户者的学号
    currentPage: curPage //当前页面
  }
  if (user) {
    data["viewerMarkNumber"] = user.markNumber;
  }
  request(baseHttpURL + '/Servlet/AnswerServlet', {
    method: 'get',
    body: data
  }).then(res => {
    //获取返回信息，进行渲染
    //调用
    if (curPage == 1) {
      $(".answerItem_List").html("");
    }
    displayAnswers(res.dataList, res.markNumber);
    if (res.next == false) {
      $(".answerItem_List").append('<div class="answerItem ending">已加载完全部回答</div>');
      //禁用加载更多回答
      isNoMoreAnswer = true;
    }
  }, err => {
    displayTipPane("加载回答失败")
  })
}
// 
function displayAnswers(arr, markNumber) {
  for (let i = 0; i < arr.length; i++) {
    //头部信息,需要student对象 
    //尾部，主要自己创建对象
    //点赞数字， 评论数字（没有），用户是否有点赞
    let oItem = $("<div class='answerItem'></div>");
    let type = arr[i].student != null ? "学生" : "教师";
    let authorObj = arr[i].student != null ? arr[i].student : arr[i].teacher;
    let isAgree = arr[i].agree == true ? "agree" : "no_agree";
    let school_info = authorObj.major || authorObj.college;
    // let reg = /(..\/)/;
    let src = authorObj.face;
    // src = src.replace(reg.exec(src)[0], "..//");

    let contentObj = {
      agreeCount: arr[i].agreeCount,
      commentCount: arr[i].commentCount,
      userType: type,
      agree: isAgree,
      time: "2020/11/1",
      face: src,
      userName: authorObj.userName,
      schoolInfo: school_info
    }
    oItem.append(template("template_answerItem", contentObj))
    //添加answerId
    // console.log(arr[i].contents);
    if (arr[i].contents[0]) {
      oItem.attr("answerId", arr[i].contents[0]["answerId"]);
    }
    // oItem.attr("answerId",arr[i].contents[0]["answerId"]);
    oItem.find(".seeComment").attr("loadingAbility", "true"); //有加载数据能力
    oItem.find(".commentList").attr("nextPage", 1);
    bindAnserItemEvent(oItem);
  
    oItem.find(".like_btn").attr("status", isAgree);
    let contentText = addAnswerContentText(arr[i].contents);
    oItem.find(".contentText").append(contentText);
    $(".answerItem_List").append(oItem);
    oItem.find(".loadmore").click(loadMoreComment);
  }
  //点击图片放大
  //  rebindSeeImage();
}

function seeComment(nextPage) {
  let obj = $(this);
  //this是查看评论按钮
  $(this).parents(".answerItem").find(".commentList").slideDown();
  if ($(this).attr("loadingAbility") == "true") { //请求第一页代表初始化
    request(baseHttpURL+"/Servlet/CommentServlet", {
      method: 'get',
      body:{
        requestType: "get",
        getType: "answer",
        answerId: $(this).parents(".answerItem").attr("answerid"),
        currentPage: nextPage
      }
    }).then(res => {
      displayComment.call(obj, res.dataList);
      if (!res.next) {
        //加载更多消失
        obj.parents(".answerItem").find(".commentList .loadmore").fadeOut();
        obj.parents(".answerItem").find(".commentList .contentBox").append('<div class="ending_comment">已加载完全部评论</div>');
        //加载完全部评论展示
      }
      obj.attr("loadingAbility", "false");
    })
    
  }
}

//只是把返回的数据进行展示
function displayComment(dataList) {
  for (let i = 0; i < dataList.length; i++) {
    let item = dataList[i];
    data = item.student != null ? item.student : item.teacher;
    data.content = item.content;
    let commentItem = template("template_commentItem", data);
    $(this).parents(".answerItem").find(".commentList .contentBox").append(commentItem);
    //$(this)查看评论按钮
  }
}
//加载更多评论，加载的更旧的评论

function loadMoreComment() {
  // console.log("加载更多评论")
  let obj = $(this);
  let commentList = $(this).parents(".commentList");
  // console.log("commentList.attr(nextPage)");
  // console.log(commentList.attr("nextPage"));
  let nextPage = parseInt(commentList.attr("nextPage")) + 1;
  commentList.attr("nextPage", nextPage);

  request(baseHttpURL+'/Servlet/CommentServlet', {
    method: 'get',
    body: {
      requestType: "get",
      getType: "answer",
      answerId: $(this).parents(".answerItem").attr("answerid"),
      // answerId : 1,
      currentPage: nextPage
    }
  }).then(res => {
    displayComment.call(obj, res.dataList);
    if (!res.next) {
      //加载更多消失
      obj.parents(".answerItem").find(".commentList .loadmore").fadeOut();
      obj.parents(".answerItem").find(".commentList .contentBox").append('<div class="ending_comment">已加载完全部评论</div>');
      //加载完全部评论展示
    }
  })
}
//重新绑定图片放大事件
function rebindSeeImage() {
  $(".fadein_img").off("click");
  $(".modal_bg_img .fadeout").off("click");
  $('.fadein_img').on("click", function () {
    $('.modal_bg_img').fadeIn();
    $('.modal_bg_img .modal').css({
      transform: 'translate(-50%,-50%) scale(1)'
    })
    $('.modal_bg_img .modal').find(".modal_content img").attr("src", $(this).attr("src"));
  })

  $('.modal_bg_img .fadeout').on("click", function () {
    $('.modal_bg_img').fadeOut(); // 其实就是css 的过渡+ display
    $('.modal_bg_img .modal').css({
      transform: 'translate(-50%,-50%) scale(0.7)'
    })
  })
}
//点击查看评论
//发布评论
function sendComment() {
  //获取内容
  let text = $(this).parents(".addComment").find(".textBox").val();
  if (text == "" || text == undefined || text == null) {
    displayTipPane("评论不能为空！");
    return;
  }
  let answerItem = $(this).parents(".answerItem");
  let data_1 = {
    requestType: "post",
    answerId: answerItem.attr("answerid"),
    markNumber: $.cookie("markNumber"),
    content: text
  };
  let obj = $(this); //this指发表评论的按钮
  //判断敏感词

  $.ajax({
    url: "../Servlet/SensitiveWordServlet",
    data: JSON.stringify({
      "textArr": [
        text
      ]
    }),
    type: "post",
    success: function (res) {
      if (res.statusCode == 500) {
        displayTipPane("内容" + res.message + "请修改后再发送！");
      } else {
        data_1.content = res[0];
        send();
      }
    }
  })

  // 发送评论
  function send() {
    $.ajax({
      url: "../Servlet/CommentServlet",
      type: "post",
      data: JSON.stringify(data_1),
      dataType: "json",
      success: function (res) {
        if (res.statusCode == 200) {
          answerItem.find(".addComment .textBox").val("");
          answerItem.find(".addComment").slideUp();
          if (answerItem.find(".seeComment").attr("loadingAbility") == "true") {
            seeComment.call(answerItem.find(".seeComment"), 1); //针对没有加载过评论就评论的
          } else {
            loadMyNewComment.call(obj, text);
          }
          answerItem.find(".commentList").slideDown();
          //发送通知
          if (res.statusCode == 200) {
            obj.parents(".like_btn").attr("status", "agree");
            obj.parents(".like_btn").addClass("agree");
            obj.parents(".like_btn").removeClass("no_agree");
            let oAgreeCount = obj.parents(".like_btn").find(".num");
            oAgreeCount.html(parseInt(oAgreeCount.html()) + 1);
            obj.attr("changing", "false");
            let data = {
              "senderMarkNumber": $.cookie("markNumber"),
              "receiverMarkNumber": obj.parents(".answerItem").attr("answerId"),
              "content": '评论了你对"' + $(".question_info_box .questionTitle").html() + '"的回答',
              "additionContent": "额外内容 可以为空",
              "type": "inf",
              "senderName": $.cookie("userName"),
              "isRead": false,
              "senderFace": $.cookie("face"),
              "requestType": "post"
            }
            sendInfo(data);
          }
        } else {
          displayTipPane("评论失败！");
        }
      }
    })
  }

  function loadMyNewComment(text) {
    let src = $.cookie("face");
    let data = {
      content: text,
      face: src,
      userName: $.cookie("userName")
    }
    let comment = template("template_commentItem", data);
    $(this).parents(".answerItem").find(".commentList .contentBox").prepend(comment);
    let oCommentCount = $(this).parents(".answerItem").find(".seeComment .num");
    oCommentCount.html(parseInt(oCommentCount.html()) + 1);
  }
}

export { fixed, inputText, readFile, sendAnswer, getAnswer }