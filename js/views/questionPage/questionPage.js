import { isLogin } from '../../common/user/index.js'
import {addImgHandler, scrollHandler, fixed, inputText, readFile, sendAnswer, getAnswer, agreeQuestion, subscribeAuthor, cancelSubscribeAuthor, loadQuestion } from './tools.js'
import {tipInfo, displayTipPane_warn, displayTipPane_success} from '../../components/content/tipPane.js'
import getLink from '../../util/copyLink.js'
import debounce from '../../util/debounce.js'
import  bindImageSacningEvent from '../../components/content/imgDisplayTemplate.js'
import scrollUp from '../../components/content/scrollToTop.js'

// 页面初始化
(function() {
  loadQuestion();
  getAnswer(1);
})()

$(window).bind("scroll", fixed);

// 绑定放大图片事件，凡是有fadeIn_img都可以放大
bindImageSacningEvent('#content_main', 'fadeIn_img');
bindImageSacningEvent('#question_main', 'fadeIn_img');

// 写回答板块的打开的与关闭
$('.question_info_main .answer_btn').click(() => {
  if (isLogin()) {
    $('.textAnswer').slideDown();
  } else {
    displayTipPane_warn(tipInfo.login.no_login);
  }
})
$('.textAnswer .slideUp').click(() => {
  $('.textAnswer').slideUp();
})

//复制便利签文本
$('#copyText').on('click',function () {
  if($('.note .content textarea').val().trim() == ''){return displayTipPane_warn("没有复制内容!")}
  $('.note .content textarea').select();
  document.execCommand("copy"); // 执行浏览器复制命令
  displayTipPane_success(tipInfo.copy.note_success)
})

// 获取当前文本链接
$(".copyurlY").on({
  click: () => {
    getLink(location.href)
  }
})

//#endregion

// 一键回答
$('.note .writeAnswer').click(function () {
  if (!isLogin()) {
    displayTipPane_warn(tipInfo.login.no_login)
    return;
  }
  if($('.note .content textarea').val().trim() == ''){return displayTipPane_warn("便利签空空如也~")}
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
$('.addImageBtn').click(addImgHandler)
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



// let answer_nowPostion = 1;
//获取回答，发送请求，获取相应，动态添加


$(window).on("scroll", debounce(scrollHandler, 10, true));


//获取某个回答的评论
//点击查看评论按钮触发
//打开面板,第一次点击时加载一页的内容
//收起后，再点击只是打开面板

// 问题点赞
$('.question_info_main .like_btn .icon').attr("changing", "false"); // 是否状态发生改变，防止多次点击，由于网络原因计数出错
$('.question_info_main .like_btn .icon').click(agreeQuestion)


$(".author_info_box .subscribe_btn").click(function () {
  if (!isLogin()) {
    displayTipPane_warn(tipInfo.login.no_login);
    return;
  }
  if ($(".author_info_box .subscribe_btn").attr("status") == "subscribe") {
    cancelSubscribeAuthor();

  } else if ($(".author_info_box .subscribe_btn").attr("status") == "no_subscribe") {
    subscribeAuthor();
  } else {
    displayTipPane_warn("作者匿名，关注已禁用！")
  }
})


// 未开发

// 分享
$('.dev').click(function() {
  displayTipPane_warn(tipInfo.dev.mes)
})



//渲染问题

//#endregion
