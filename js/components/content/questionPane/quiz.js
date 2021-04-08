import {textInputHandler, getKeyword, addImage, addLableManually, sendQuestion, BindrRmoveItemEvent } from './tool.js'
// 作用是点击空白处能关闭模态框
$(".quizModal_bg").on({
  click: function () {
    $('.quizModal_bg').fadeOut(); // 其实就是css 的过渡+ display
    $('.quizModal').css({
      transform: 'translate(-50%,-50%) scale(0.7)'
    })
  }
})
$(".quizModal").on({
  click: function (e) {
    e.stopPropagation();
  }
})
// 点击X关闭
$('.quizModal .fadeout').click(function () {
  $('.quizModal_bg').fadeOut(); // 其实就是css 的过渡+ display
  $('.quizModal').css({
    transform: 'translate(-50%,-50%) scale(1)'
  })
})

// 文本域字数限制
$(".quizModal_bg_askQuestion textarea").on("change", textInputHandler)

// 绑定删除图片事件
BindrRmoveItemEvent('#picture_container', 'removePicture', function () {
  $(this).parent('.picture').remove();
})

// 绑定删除标签事件
BindrRmoveItemEvent('#label_container', 'removeLabel', function () {
  $(this).parent('.labelItem').remove();
})


//打开文章列表
$(".quizModal_bg_askQuestion .questionType svg").click(function () {
  $('.quizModal_bg_askQuestion .questionType .list').slideDown();
})
$('.quizModal_bg_askQuestion .questionType .list').mouseleave(function () {
  $(this).slideUp();
})
$('.quizModal_bg_askQuestion .questionType .list li').click(function () {
  $('.quizModal_bg_askQuestion .questionType .cur_val').attr("value", $(this).html());
  $('.quizModal_bg_askQuestion .questionType .cur_val').html($(this).html());
  $('.quizModal_bg_askQuestion .questionType .list').slideUp();
})
//根据输入的问题自动生成标签
$(".quizModal_bg_askQuestion .mainQuestion textarea").on("blur", getKeyword);


//自行添加标签
$(".quizModal_bg_askQuestion .addLabel .add_btn").click(addLableManually)

$(".insertP").on({change: addImage})


// 匿名事件绑定
$(".quizModal_bg_askQuestion .anonymity .btn").click(function () {
  if ($(this).parent().attr("anonymity") == 'false') {
    $(this).parent().attr("anonymity", 'true');
    $(this).find("svg").css("display", "block");
  } else {
    $(this).parent().attr("anonymity", 'false');
    $(this).find("svg").css("display", "none");
  }
})

$(".quizModal_bg_askQuestion .publish").click(sendQuestion);
