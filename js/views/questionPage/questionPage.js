import { user } from '../../common/user/index.js'
import { fixed, inputText, readFile, sendAnswer, getAnswer } from './tools.js'
import displayTipPane from '../../commponents/content/tipPane.js'
import getLink from '../../util/copyLink.js'
import debounce from '../../util/debounce.js'


// 页面初始化
function initPage() {
  loadQuestion();
  getAnswer(1);
}

$(window).bind("scroll", fixed);

// 写回答板块的打开的与关闭
$('.question_info_main .answer_btn').click(() => {
  if (user) {
    $('.textAnswer').slideDown();
  } else {
    displayTipPane("请先完成登录");
  }
})
$('.textAnswer .slideUp').click(() => {
  $('.textAnswer').slideUp();
})

//复制便利签文本
$('.note .copyText').click(function () {
  $('.note .content textarea').select();
  document.execCommand("copy"); // 执行浏览器复制命令
})


$(".copyurlY").on({
  click: getLink
})

//#endregion

$('.note .writeAnswer').click(function () {
  if (!user) {
    displayTipPane("请先完成登录！")
    return;
  }
  scrollUp();
  $('.textAnswer').slideDown();
  $('.textAnswer').find(".edit-div").eq(0).html($('.note .content textarea').val());
})

$(".modal_bg_img").on({
  click: function () {
    $('.modal_bg_img').fadeOut(); // 其实就是css 的过渡+ display
    $('.modal_bg_img .modal').css({
      transform: 'translate(-50%,-50%) scale(0.7)'
    })
  }
})
//取消冒泡
$(".modal").on({
  click: function (e) {
    e.stopPropagation();
  }
})

//#endregion

// 窗口缩放
$(window).bind("resize", fixed);

//设置背景高度
$('#fadeinLogon').click(function () {
  $("input").val("");
  $(".logOn").siblings().fadeOut();
  $(".logOn").fadeIn();
  $('.modal_bg_logon').fadeIn();
  $('.modal_bg_logon .modal').css({
    transform: 'translate(-50%,-50%) scale(1)'
  })
})
$('.fadeout').click(function () {
  $('.modal_bg_logon').fadeOut(); // 其实就是css 的过渡+ display
  $('.modal_bg_logon .modal').css({
    transform: 'translate(-50%,-50%) scale(0.7)'
  })
})
//#endregion

// 评论区点击按钮添加图片,把图片显示到输入框中

//点击"+"相当于点击input[type=file]
$('.addImageBtn').click(() => {
  if (sendingImg) {
    displayTipPane("有图片正在上传中...");
  } else {
    $('.file_input').click();
  }
})
// 什么是否提取文字，不能在选择图片之后就提取，应该要最终再提取，最后遍历所有节点，遍历到图片后，断开
//在本节点的下一个节点插入一个新的div,并且把光标给下一个div

$(".edit-div").keydown(function () {
  let arg = arguments;
  inputText.apply($(this), arg);
})


//读取图片文件 
$('.file_input').change(readFile);
//读图片，添加到输入框中

//解决的问题是：formdata对象应该是要
//编辑区div行的指针
//插入图片：现在就只能插入到输入框的最后




//点击发送按钮
$("#sendAnswerBtn").click(function () {
  sendAnswer();
})
//
//一进入之后加载一些
let answerPage = 1;
let totalAnswerPage = 1;

// let answer_nowPostion = 1;
//获取回答，发送请求，获取相应，动态添加

//  滑到底部加载更多回答
let isNoMoreAnswer = false;
$(window).on("scroll", debounce(function () {
  //滚动条到顶部的高度
  let scrollTop = Math.ceil($(this).scrollTop());
  //窗口高度
  let curHeight = $(this).height();
  //整个文档高度
  let totalHeight = $(document).height();
  //滚动条到底
  if (scrollTop + curHeight >= totalHeight) {
    //还要根据是否有下一页判断可进行发送请求
    if (isNoMoreAnswer) {
      displayTipPane("没有更多回答了哦！");
      return;
    }
    getAnswer(++answerPage);
    //console.log(123);
  }
}, 10, true));


//获取某个回答的评论
//点击查看评论按钮触发
//打开面板,第一次点击时加载一页的内容
//收起后，再点击只是打开面板

// 问题点赞
$('.question_info_main .like_btn .icon').attr("changing", "false"); // 是否状态发生改变，防止多次点击，由于网络原因计数出错
$('.question_info_main .like_btn .icon').click(function () {
  //当前点击状态
  if (!isLogon) {
    displayTipPane("请先完成登录");
    return;
  }
  if ($(this).attr("changing") == "true") {
    return;
  }
  $(this).attr("changing", "true");
  let status = $(this).parents(".like_btn").attr("status");
  let obj = $(this);
  if (status == "agree") { //再次点击为取消点赞
    $.ajax({
      url: "../Servlet/AgreeServlet",
      type: "get",
      dataType: "json",
      data: {
        requestType: "delete",
        agreeType: "question",
        markNumber: $.cookie("markNumber"),
        questionId: questionId_local //先写这个
      },
      success: function (res) {
        console.log(res);
        obj.parents(".like_btn").attr("status", "no_agree");
        obj.parents(".like_btn").addClass("no_agree");
        obj.parents(".like_btn").removeClass("agree");
        let oAgreeCount = obj.parents(".like_btn").find(".num");
        oAgreeCount.html(parseInt(oAgreeCount.html()) - 1);
        obj.attr("changing", "false");

      }
    })
  } else if (status == "no_agree") {
    $.ajax({
      url: "../Servlet/AgreeServlet",
      type: "post",
      dataType: "json",
      data: JSON.stringify({
        requestType: "post",
        agreeType: "question",
        markNumber: $.cookie("markNumber"),
        questionId: questionId_local //先写这个
      }),
      success: function (res) {
        if (res.statusCode == 200) {
          obj.parents(".like_btn").attr("status", "agree");
          obj.parents(".like_btn").addClass("agree");
          obj.parents(".like_btn").removeClass("no_agree");
          let oAgreeCount = obj.parents(".like_btn").find(".num");
          oAgreeCount.html(parseInt(oAgreeCount.html()) + 1);
          obj.attr("changing", "false");
          let data = {
            "senderMarkNumber": $.cookie("markNumber"),
            "receiverMarkNumber": oAuthor.markNumber,
            "content": '点赞了你的问题"' + $(".question_info_box .questionTitle").html() + '"',
            "additionContent": "额外内容 可以为空",
            "type": "inf",
            "senderName": $.cookie("userName"),
            "isRead": false,
            "senderFace": $.cookie("face"),
            "requestType": "post"
          }
          sendInfo(data);
        }
      }
    })
  }
})
// 回答点赞
//加载回答的时候 初始化自己是否有点赞
//初始化changing = false
//绑定函数 $('.answerItem .like_btn .icon').click();
//  $('.answerItem .like_btn .icon').click();
//回答点赞函数
function agreeAnswer(markNumber_2) {
  //当前点击状态
  if (isLogon == false) {
    displayTipPane("请先登录！");
    return;
  }
  if ($(this).attr("changing") == "true") {
    return;
  }
  $(this).attr("changing", "true");
  let status = $(this).parents(".like_btn").attr("status");
  let obj = $(this);
  // console.log($(this));
  if (status == "agree") { //再次点击为取消点赞
    $.ajax({
      url: "../Servlet/AgreeServlet",
      type: "get",
      dataType: "json",
      data: {
        requestType: "delete",
        agreeType: "answer",
        markNumber: $.cookie("markNumber"),
        answerId: $(this).parents(".answerItem").attr("answerId")
      },
      success: function (res) {
        console.log(res);
        obj.parents(".like_btn").attr("status", "no_agree");
        obj.addClass("no_agree");
        obj.removeClass("agree");
        let oAgreeCount = obj.parents(".like_btn").find(".num");
        oAgreeCount.html(parseInt(oAgreeCount.html()) - 1);
        obj.attr("changing", "false");
      }
    })
  } else if (status == "no_agree") {
    //点赞
    $.ajax({
      url: "../Servlet/AgreeServlet",
      type: "post",
      dataType: "json",
      data: JSON.stringify({
        requestType: "post",
        agreeType: "answer",
        markNumber: $.cookie("markNumber"),
        answerId: $(this).parents(".answerItem").attr("answerId") //先写这个
      }),
      success: function (res) {
        console.log("markNumber" + markNumber_2);
        if (res.statusCode == 200) {
          obj.parents(".like_btn").attr("status", "agree");
          obj.addClass("agree");
          obj.removeClass("no_agree");
          let oAgreeCount = obj.parents(".like_btn").find(".num");
          oAgreeCount.html(parseInt(oAgreeCount.html()) + 1);
          obj.attr("changing", "false");
          let data = {
            "senderMarkNumber": $.cookie("markNumber"),
            "receiverMarkNumber": markNumber_2,
            "content": '点赞了你对"' + $(".question_info_box .questionTitle").html() + '"的回答',
            "additionContent": "额外内容 可以为空",
            "type": "inf",
            "senderName": $.cookie("userName"),
            "isRead": false,
            "senderFace": $.cookie("face"),
            "requestType": "post"
          }
          sendInfo(data);
        }
      }
    })
  }
}
//加载问题
//要用jsp
//关注作者
function subscribeAuthor() {
  $.ajax({
    url: "../Servlet/AttentionServlet",
    type: "post",
    dataType: 'json',
    data: JSON.stringify({
      "majorMarkNumber": $.cookie("markNumber"),
      "passMarkNumber": oAuthor.markNumber,
      "requestType": "post"
    }),
    success: function (res) {
      if (res.statusCode == 200) {
        $(".author_info_box .subscribe_btn").addClass("subscribe");
        $(".author_info_box .subscribe_btn").removeClass("no_subscribe");
        $(".author_info_box .subscribe_btn").attr("status", "subscribe");
        $(".author_info_box .subscribe_btn").html("已关注");
        let data = {
          "senderMarkNumber": $.cookie("markNumber"),
          "receiverMarkNumber": oAuthor.markNumber,
          "content": "关注了你",
          "additionContent": "额外内容 可以为空",
          "type": "inf",
          "senderName": $.cookie("userName"),
          "isRead": false,
          "senderFace": $.cookie("face"),
          "requestType": "post"
        };
        sendInfo(data);
      }
    }
  })
}

function cancelSubscribeAuthor() {

  $.ajax({
    url: "../Servlet/AttentionServlet",
    type: "get",
    dataType: "json",
    data: {
      requestType: "delete",
      majorMarkNumber: $.cookie("markNumber"),
      passMarkNumber: oAuthor.markNumber
    },
    success: function (res) {
      if (res.statusCode == 200) {
        $(".author_info_box .subscribe_btn").removeClass("subscribe");
        $(".author_info_box .subscribe_btn").addClass("no_subscribe");
        $(".author_info_box .subscribe_btn").attr("status", "no_subscribe");
        $(".author_info_box .subscribe_btn").html("关注");
        let data = {
          "senderMarkNumber": $.cookie("markNumber"),
          "receiverMarkNumber": oAuthor.markNumber,
          "content": "取消对你的关注。",
          "additionContent": "额外内容 可以为空",
          "type": "inf",
          "senderName": $.cookie("userName"),
          "isRead": false,
          "senderFace": $.cookie("face"),
          "requestType": "post"
        };
        sendInfo(data);
      }
    }
  })
}
$(".author_info_box .subscribe_btn").click(function () {
  if (isLogon == false) {
    displayTipPane("请先完成登录!");
    return;
  }
  if ($(".author_info_box .subscribe_btn").attr("status") == "subscribe") {
    cancelSubscribeAuthor();

  } else if ($(".author_info_box .subscribe_btn").attr("status") == "no_subscribe") {
    subscribeAuthor();
  } else {
    displayTipPane("作者匿名，关注已禁用！")
  }
})



function loadQuestion() {
  let data1 = {
    requestType: "get",
    questionId: questionId_local, //需要jsp来获取请求
  }
  if (isLogon) {
    data1["viewerMarkNumber"] = $.cookie("markNumber");
  }
  $.ajax({
    url: "../Servlet/QuestionServlet",
    type: 'get',
    dataType: 'json',
    data: data1,
    success: function (res) {
      console.log(res);
      setQuestionMain(res);
      setAuthorInfo(res);
    }
  })
}
//渲染问题

function setQuestionMain(data) {
  //title
  $('.question_info_main .questionTitle').html(data.title);
  //labels
  for (let i = 0; i < data.tag.length; i++) {
    $('.question_info_main .questionLabel').append('<span class="label"  >' + data.tag[i] + '</span>');
  }
  //detail
  $('.question_info_main .questionDetail').html(data.contents[0]["contentMain"]);
  //img
  for (let i = 1; i < data.contents.length; i++) {
    // let reg = /(..\/)/;
    let src = data.contents[i]['contentMain'];
    // console.log(authorObj);
    // console.log("图片地址:"+src);
    // src = src.replace(reg.exec(src)[0], "../");
    $('.question_info_main .questionImage').append('<img title="点击放大" class="fadein fadein_img" src="' + src + '">');

    //点击图片放大
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
    //点赞数
    //收藏数     
  }

  //是否点赞
  if (data.agree) {
    $('.question_info_main .like_btn').attr("status", "agree");
    $('.question_info_main .like_btn').addClass("agree");

  } else {
    $('.question_info_main .like_btn').attr("status", "no_agree");
    $('.question_info_main .like_btn').addClass("no_agree");
  }
  //点赞数目
  $('.question_info_main .like_btn .num').html(data.agreeCount);
}

// 渲染作者
function setAuthorInfo(data) {
  //是否关注作者
  //判断作者是否匿名
  //头像默认 用户名改匿名
  let src;

  if (data.userType == "student") {
    oAuthor = data.student;
    $(".author_info_box .userType").html("学生");
    $(".author_info_box .schoolInfo").html(oAuthor.major);

    //私信设置target和targetName
    $(".author_info_box .chatBtn").attr("target", oAuthor.markNumber);
    $(".author_info_box .chatBtn").attr("targetName", oAuthor.userName);
  } else {
    oAuthor = data.teacher;
    $(".author_info_box .userType").html("老师");
    $(".author_info_box .schoolInfo").html(oAuthor.college);
    //私信设置target和targetName
    $(".author_info_box .chatBtn").attr("target", oAuthor.markNumber);
    $(".author_info_box .chatBtn").attr("targetName", oAuthor.userName);
  }

  if (data.anonymity) {
    src = "../img/defaultStudentFace.jpg"
    $(".author_info_box .userName").html("匿名");
  } else {
    src = oAuthor.face;
    $(".author_info_box .userName").html(oAuthor.userName);
  }
  // let reg = /(..\/)/;
  // src = src.replace(reg.exec(src)[0], "..//");
  $('.author_info_box .profile img').attr("src", src);

  //关注和私信禁用
  if (data.anonymity) {
    $(".author_info_box .subscribe_btn").html("禁用");
    $(".author_info_box .subscribe_btn").attr("status", "forbidden");
    $(".author_info_box .subscribe_btn").addClass("forbidden");
  } else {
    if (data.attentionAuthor) {
      console.log("已关注作者")
      $(".author_info_box .subscribe_btn").attr("status", "subscribe");
      $(".author_info_box .subscribe_btn").addClass("subscribe");
      $(".author_info_box .subscribe_btn").html("已关注");
    } else {
      $(".author_info_box .subscribe_btn").attr("status", "no_subscribe");
      $(".author_info_box .subscribe_btn").addClass("no_subscribe");
      $(".author_info_box .subscribe_btn").html("关注");
    }
  }
}
//复制问题链接
$('.copyLink_btn').click(function () {
  let query = window.location.href;
  //window.location.href
  // displayTipPane(query);
  // displayTipPane("复制成功！");
  let oInput = $("#copyURL");
  // console.log(oInput);
  oInput.val(query);
  oInput.select();
  document.execCommand("copy"); // 执行浏览器复制命令
})

//敏感词
//回答和评论都有判断
//发送通知
function sendInfo(data) {
  // console.log("发送了通知！")
  $.ajax({
    url: "../Servlet/InfServlet",
    type: "post",
    data: JSON.stringify(data),
    success: function (res) {
      // console.log("通知成功！");
    }
  })
}


//#endregion





function createWebSocket1() {
  ws = new WebSocket(wsUrl);
  ws.onclose = function () {
    displayTipPane("关闭聊天连接");
  }
  ws.onerror = function () {
    displayTipPane("连接异常")
  }
  ws.onmessage = function (event) {
    addReceived(event.data);
  }
  ws.onopen = function () {
    displayTipPane("连接成功")
  }
}

// 创建一个webSocket与服务器进行连接
// 制作表情面板



//面板的打开与关闭  
//nav有写
// $(".platform_chat .face").on("click", function (e) {
//   e.stopPropagation()
//   $(".facePane").fadeIn(230);
//   $(".facePane").css("display", "flex");

// })
// $('body').on("click", function () {
//   $(".facePane").fadeOut(230);
// })


// // 关闭聊天面板
// $('.close_btn').click(function () {
//   $(".platform_chat").fadeOut(200);
// })



//聊天
let lockReconnect = false;//避免重复连接
let myMarkNumber = "191543214";//要获取cookie
let wantToSendMarkNumber = "123456789";//随便写一个，目的是与服务进行连接
let url = "ws://192.168.137.105:8080/WebSocket";
let wsUrl //点击某一个私信后重新修改
let ws;
let tt;
let ulNode = document.getElementById("ulNode");
let screen_inner = document.getElementById("screen_inner");

// initialWebSocket();//首次与服务器进行连接

// 退出登录调用
function closeWebSocket() {
  ws.close();
  $(".platform_chat").fadeOut();
}

let lastTarget = null;
// 开始聊天,点击私信进行连接
$(".chatBtn").on("click", function () {
  wantToSendMarkNumber = $(this).attr("target");
  wsUrl = url + '/' + myMarkNumber + '/' + wantToSendMarkNumber;
  //重新连接WebSocket

  //用户名
  $(".platform_chat .targetName").text($(this).attr("targetName"));
  if (lastTarget != null && lastTarget != $(this).attr("target")) {
    ulNode.innerHTML = "";
  }
  lastTarget = $(this).attr("targetName");

  $(".platform_chat").fadeIn();

  //这次的webSocket是有发送目标的
  createWebSocket1();
});

//历史记录
function loadHistoryInfo(target) {//获取与某一个人的具体历史信息，target的对方的markNumber
  //遍历，添加
}

// 消息发送
//文本的发送，回车键或者点击发送按钮进行发送
//表情是点击某一个表情，发送一个表情图片地址,表情需要限制尺寸大小
//图片需要上传图片，上传完后发送的还是图片的地址


// 文本发送
function getTextInfo() {
  //判空处理
  let reg = /^\s*$/
  if (reg.test($(".platform_chat textarea").val())) {
    displayTipPane("输入文本不能为空！")
    $(".platform_chat textarea").val("");
    return null;
  }
  let date = new Date();
  let sendTime = date.getTime();
  let textInfo = {
    "senderMarkNumber": myMarkNumber,
    "senderFace": $.cookie("face"),
    "senderName": $.cookie("userName"),
    "contentType": "text",
    "sendTime": "" + sendTime,
    "content": $(".platform_chat textarea").val()
  }
  $(".platform_chat textarea").val("");
  return textInfo;
}

function sendText() {
  let textInfo = getTextInfo();
  if (textInfo != null) {//非空
    addSend(textInfo);
    ws.send(JSON.stringify(textInfo));//发送json对象
  }
}

// 点击发送按钮
$(".platform_chat input[type='button']").on("click", function () {
  sendText();
  $(".platform_chat textarea").val("")
  // displayTipPane("发送文本")
})

//回车键发送
$(".platform_chat textarea").on("keydown", function (e) {

  if (e.keyCode == 13 || e.keyCode == 108) {
    sendText();
    e.preventDefault()
    $(".platform_chat textarea").val("")
  }
})




//表情发送, 鼠标点击某一个表情时触发函数
function setFaceEventListener() {
  let date = new Date();
  let sendTime = date.getTime();
  let faceInfo = {
    "senderMarkNumber": myMarkNumber,
    "senderFace": $.cookie("face"),
    "senderName": $.cookie("userName"),
    "contentType": "face",
    "sendTime": "" + sendTime,
    "content": $(this).attr("src")
  }

  addSend(faceInfo);
  ws.send(JSON.stringify(faceInfo));
}


//图片发送
//上传图片
//成功后发送消息


//读取图片文件 

$('.platform_chat .picture').click(() => {
  if (sendingImg) {
    displayTipPane("有图片正在上传中...");
  } else {
    $('#sendImgBtn').click();
  }
})
$('#sendImgBtn').change(readFile_chat);
//读图片，添加到输入框中
let oinput = document.getElementById("sendImgBtn");

//读取文件
function readFile_chat() {
  let formdata = new FormData();
  if (!oinput['value'].match(/.jpg|.gif|.png|.jpeg|.bmp/i)) {　　 //判断上传文件格式
    return displayTipPane("图片格式有误！");
  }

  formdata.append(0, this.files[0]); // formdata 的属性
  //成功后上传图片
  sendImage_chat(formdata);
}

let sendingImg = false;
function sendImage_chat(formdata) {
  sendingImg = true;
  $.ajax({
    url: 'http://192.168.137.105:8080/Servlet/ReceiveFileServlet',
    type: 'post',
    data: formdata,
    dataType: 'json',
    processData: false, //用FormData传fd时需有这两项
    contentType: false,
    success: function (data) {
      sendingImg = false;
      // imgObj.attr("src", data.message);
      //图片上传成功后拿取返回的url
      sendImg_chatContent(data.message);
    },
    error: function (data) {
      sendingImg = false;
      displayTipPane("图片上传失败！")
    },
    timeout: function (data) {
      sendingImg = false;
      displayTipPane("图片上传超时！")
    }
  })
}


//发送图片信息
function sendImg_chatContent(url) {
  let date = new Date();
  let sendTime = date.getTime();
  let imgInfo = {
    "senderMarkNumber": myMarkNumber,
    "senderFace": $.cookie("face"),
    "senderName": $.cookie("userName"),
    "contentType": "img",
    "sendTime": "" + sendTime,
    "content": url
  }
  addSend(imgInfo);
  ws.send(JSON.stringify(imgInfo));
}

// img是css查询条件
function isImgLoad(callback, img) {
  $(img).each(function () {
    if (this.height === 0) {
      isLoad = false;
      return false;
    }
  });
  if (isLoad) {
    clearTimeout(t_img);
    callback();
  } else {
    isLoad = true;
    t_img = setTimeout(function () {
      isImgLoad(callback);
    }, 100)
  }
}

// 添加接受的消息函数
function addReceived(data) {
  // displayTipPane(data);
  //判断data类型 img | text
  // console.log(data);
  data = JSON.parse(data);
  // console.log(data);

  let liNode = document.createElement("li");
  liNode.classList.add("target");
  if (data.contentType == "text") {
    liNode.innerHTML = '<img class="profile" src="' + data.senderFace + '"><span class="text">' + data.content + '</span>';
  } else if (data.contentType == "face") {//表情,大小有限制
    liNode.innerHTML = '<img class="profile" src="' + data.senderFace + '"><span class="text"><img src="' + data.content + '" height="28px"></span>';
  } else if (data.contentType == "img") {//图片，大小有限制，但是比表情大一点
    // data.content = "http://192.168.137.105:8080"+data.content.substring(2);
    liNode.innerHTML = '<img class="profile" src="' + data.senderFace + '"><span class="text"><img  src="' + data.content + '" style="max-width:130px; margin:5px;border-radius:4px;cursor:zoom-in;cursor:-webkit-zoom-in" class="fadein_img"></span>';
    ulNode.appendChild(liNode);
    // let oImg = liNode.getElementsByTagName("img")[0];
    rebindSeeImage();
    isImgLoad(function () {
      screen_inner.scrollTop = screen_inner.scrollHeight - screen_inner.clientHeight;
    }, liNode.getElementsByTagName("img"));
    return;
  }
  ulNode.appendChild(liNode);
  screen_inner.scrollTop = screen_inner.scrollHeight - screen_inner.clientHeight;
}
//添加发送的出去的消息
function addSend(data) {
  // displayTipPane(data);
  //判断data类型 img | text
  let liNode = document.createElement("li");
  liNode.classList.add("me");

  if (data.contentType == "text") {
    liNode.innerHTML = '<span class="text">' + data.content + '</span><img class="profile" src="' + data.senderFace + '">';
  } else if (data.contentType == "face") {//表情,大小有限制
    liNode.innerHTML = '<span class="text"><img src="' + data.content + '" height="28px"></span><img class="profile" src="' + data.senderFace + '">';

  } else if (data.contentType == "img") {//图片，大小有限制，但是比表情大一点

    data.content = "http://192.168.137.105:8080" + data.content.substring(2);
    liNode.innerHTML = '<span class="text"><img  src="' + data.content + '" style="max-width:130px; border-radius:4px; margin:5px;cursor:zoom-in;cursor:zoom-in;cursor:-webkit-zoom-in" class="fadein_img"></span><img class="profile" src="' + data.senderFace + '">';
    ulNode.appendChild(liNode);
    //添加事件
    // let oImg = liNode.getElementsByTagName("img")[0];
    // $(oImg).on('click',rebindSeeImage);
    rebindSeeImage();
    isImgLoad(function () {
      screen_inner.scrollTop = screen_inner.scrollHeight - screen_inner.clientHeight;
    }, liNode.getElementsByTagName("img"));
    return;

  }
  ulNode.appendChild(liNode);
  screen_inner.scrollTop = screen_inner.scrollHeight - screen_inner.clientHeight;


}

//登录成功和自动登录时使用
function initialWebSocket() {
  myMarkNumber = $.cookie("markNumber");
  wantToSendMarkNumber = "123456789";
  wsUrl = url + '/' + myMarkNumber + '/' + wantToSendMarkNumber;
  createWebSocket1();
}

//点击其他聊天后也要调用，重新连接websocket
function createWebSocket() {

  try {
    ws = new WebSocket(wsUrl);
    init();
  } catch (e) {
    displayTipPane('catch');
    reconnect();
  }

}
function init() {
  ws.onclose = function () {
    displayTipPane('链接关闭');
    reconnect();
  };
  ws.onerror = function () {
    displayTipPane('发生异常了');
    reconnect();
  };
  ws.onopen = function () {
    //心跳检测重置
    displayTipPane("webSocket连接成功");
    heartCheck.start();
  };
  ws.onmessage = function (event) {
    //拿到任何消息都说明当前连接是正常的
    console.log(event)
    //消息的展示,不是心跳验证码,就小红点出现，用户发送过来的数据也开始动态添加
    addReceived(event.data);
    // if(event.data!="#1#"){
    //     addReceived(event.data);
    // }
    heartCheck.start();
  }
  //发送消息
}
function reconnect() {
  if (lockReconnect) {
    return;
  };
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt);
  tt = setTimeout(function () {
    createWebSocket(wsUrl);//重新连接，递归
    lockReconnect = false;
  }, 4000);
}
//心跳检测
let heartCheck = {
  timeout: 3000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function () {
    // displayTipPane('start');
    let self = this;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //   displayTipPane('55555');
      ws.send("123456789");//如果是后端还在线，就会触发onmessage事件
      //3s不返回消息就会关闭webSocket，否则就会关闭该定时器继续进行心跳检测
      self.serverTimeoutObj = setTimeout(function () {
        // displayTipPane(111);
        // displayTipPane(ws);
        ws.close();
        // createWebSocket();
      }, self.timeout);

    }, this.timeout)
  }
}


function createWebSocket1() {
  ws = new WebSocket(wsUrl);
  ws.onclose = function () {
    displayTipPane("关闭聊天连接");
  }
  ws.onerror = function () {
    displayTipPane("连接异常")
  }
  ws.onmessage = function (event) {
    addReceived(event.data);
  }
  ws.onopen = function () {
    displayTipPane("连接成功")
  }
}

// 创建一个webSocket与服务器进行连接
// 制作表情面板

function addFace() {
  for (let i = 1; i <= 25; i++) {
    let oImg = $('<img src="../emoji/' + i + '.png">');
    $(".facePane").append(oImg);
    oImg.on("click", setFaceEventListener);
  }
}
addFace();

//面板的打开与关闭  

$(".platform_chat .face").on("click", function (e) {
  e.stopPropagation()
  $(".facePane").fadeIn(230);
  $(".facePane").css("display", "flex");

})
$('body').on("click", function () {
  $(".facePane").fadeOut(230);
})


// 关闭聊天面板
$('.platform_chat .close_btn').click(function () {
  $(".platform_chat").fadeOut(200);
})



