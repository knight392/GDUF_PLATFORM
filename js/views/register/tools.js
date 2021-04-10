import { baseHttpURL } from '../../common/baseRequestInfo.js'
import request from '../../util/request.js'
import {displayTipPane_success} from '../../components/content/tipPane.js'
import data_major from './majors'
let time = 0;
let timer = null;
let major_target = 30;//专业的初始下拉高度

function statusDisplay() {
  $('.status header').fadeOut();
  $('.status .content').fadeIn();
}
function forbidSendConfirm() {
  // 60
  time = 60;
  $('.send_btn').attr("disabled", "disabled");
  $('.send_btn').addClass('btn_disable');
  $('.send_btn').removeClass('btn_available');
  $('.confirm_input').val("");
  timer = setInterval(setSendBtn, 1000);
  $('.send_btn').val("60s后重发");
}

//判断输入框是否为空
function isEmpty($obj, $errorMessage) {
  if ($obj.val() == '') {
    $obj.attr('placeholder', $errorMessage);
    $obj.addClass('error');
    return true;
  }
  return false;
}
//清空错误信息
function clearErrorMessage($obj, $tip) {
  $obj.attr('placeholder', $tip);
  $obj.removeClass('error');
}

//邮箱有效性验证 //不能为中文
function isEmailAvailable($errorMessage) {
  let $obj = $(".email_input");
  let reg = /^m.*$/;
  let reg2 = /[\u4E00-\u9FFF]+/;//非中文
  if (reg2.test($obj.val())) {
    $obj.attr('placeholder', $errorMessage);
    $obj.val("");
    $obj.addClass('error');
    return false;
  }
  //学生
  if (reg.test($('.email_tail').html())) {
    let reg1 = /^(\d|\w){9}$/; //开头和结尾一定要做好
    if (!reg1.test($('.email_input').val())) {
      $obj.val("");
      $obj.attr('placeholder', $errorMessage);
      $obj.addClass('error');
      return false;
    }
  }
  return true;
}



function getUserType() {
  let reg = /^m/;
  if (reg.test($('.email_tail').html())) {
    return 'student';
  }
  return 'teacher';
}

//判断用户名、邮箱是否存在
/**
 * 
 * @param {*} field username | email
 * @param {*} value 
 * @param {*} userType student | teacher
 * @returns 
 */
function dataIsExiste(field, value, userType) {
  return new Promise((resolve, reject) => {
    request(`${baseHttpURL}/Servlet/IsExistInfoServlet`, {
      method: 'get',
      body: {
        field,
        value,
        userType,
        requestType: 'get'
      }
    }).then(res => {
      // 200 存在 | 500 不存在
      if(res.statusCode == 200){
        resolve(true)
      }else{
        resolve(false)
      }
    })
  })
}


//设置错误信息

//设置发送验证的按钮的样式
function setSendBtn() {
  //console.log("定时器");
  if (time == 0) {
    clearInterval(timer);
    $('.send_btn').removeAttr('disabled');
    $('.send_btn').removeClass('btn_disable');
    $('.send_btn').addClass('btn_available');
    $('.send_btn').val("发送验证码");
  } else {
    time--;
    $('.send_btn').val(time + "s后重发");
  }
}


// 判断验证码是否成功
function judgeCode(code) {
  return new Promise((resolve, reject) => {
    request(baseHttpURL+'', {
      method: 'get',
      body: code
    }).then(res => {
      if(res.statusCode == 200) {
        resolve(true)
      }else{
        resolve(false)
      }
    })
  })
}



//选择进入那一个注册页面的逻辑
function changeToNextPage(nextPage) {
  //本页缩小,左滑消失
  displayTipPane_success("邮箱验证成功！");
  setTimeout(() => {
    $('.modal_bg').fadeOut();
    $('#form1').animate({
      left: "-400px",
    });
    $('#form1').fadeOut();
    $(nextPage).fadeIn();
  }, 1000)
  //下一页初始为缩小，然后一边右滑到中间，一边放大
  //还要根据不同的身份进行不同的拿取
}


//性别、校区的动画效果
function animationDisplay(obj, item1, item2) {
  //选项选择
  $(obj + ' .switch').click(function () {
    $(obj + ' .item').css({
      display: "none",
    })
    $(obj + ' ' + item2).css({
      left: "",
      right: "5px",
      textAlign: 'right'
    })
    $(this).fadeOut();
    $(obj + ' .item').fadeIn();
  })
  //点击选中
  $(obj + ' .item').bind("click", function () {
    $(obj + ' .switch').fadeIn();
    $(obj + ' .value').attr('data', $(this).find('.text').html())
  })
  //选择1
  $(obj + ' ' + item1).bind('click', function () {
    $(obj + ' ' + item2).fadeOut();
  })
  //选择2
  $(obj + ' ' + item2).bind('click', function () {
    $(obj + ' ' + item1).fadeOut();
    $(this).css({
      right: "",
      textAlign: "left"
    }).animate({
      left: "5px"
    })
  })
}


//下拉展示栏动画
function animationSlide(obj, target) {
  $(obj + " .list").click(function (event) {
    let event = event || $(window).event;
    let target = event.target || event.srcElement;
    if (target.nodeName.toLowerCase() == 'li') {
      $(this).fadeOut();
      $(obj + ' .choice').attr("data", target.textContent);
      $(obj + ' .choice .cur_val').html(target.textContent);
      if (obj == '.college') {
        fillMajorContent(target.textContent);
      }
    }
  })
  $(obj + " .choice").mouseleave(function () {
    $(obj + ' .list').fadeOut();
  })
  $(obj + " .choice").click(display)

  function display() {
    $(obj + ' .list').css({
      "display": 'block',
      "height": "0"
    }).animate({
      height: target + 'px'
    })
  }
}

//专业的下拉动画展示
function animationSlide_major(obj) {
  $(obj + " .list").click(function (event) {
    let event = event || $(window).event;
    let target = event.target || event.srcElement;
    if (target.nodeName.toLowerCase() == 'li') {
      $(this).fadeOut();
      $(obj + ' .choice').attr("data", target.textContent);
      $(obj + ' .choice .cur_val').html(target.textContent);
      if (obj == '.college') {
        fillMajorContent(target.textContent);
      }
    }
  })
  $(obj + " .choice").mouseleave(function () {
    $(obj + ' .list').fadeOut();
  })
  //点击内容框进行展示
  $(obj + " .choice").click(display)

  function display() {
    $(obj + ' .list').css({
      "display": 'block',
      "height": "0"
    }).animate({
      height: major_target + 'px'
    })
  }
}

//根据不同学院填充不同的专业
function fillMajorContent(key) {
  let majors = data_major[key];
  $('.major .cur_val').html(majors[0]);
  $('.major .value').attr('data', majors[0]);
  $('.major .list').empty();//删除子元素
  if (majors.length <= 8) {//最多8个 30为高
    major_target = 30 * majors.length; //major_target是全局变量，通过学院的选择进行动态变化
  } else {
    major_target = 30 * 8;
  }
  for (let i = 0; i < majors.length; i++) {
    $('.major .list').append('<li>' + majors[i] + '</li>');
  }
}

function viewChange(view) {
  if (view == false) {
    $(this).parent().find('input').attr({
      "type": "text",
      "readonly": "readonly"
    });
    $(this).html('<path d="M938.122 577.92c-16.128-55.68-51.584-106.122-100.8-147.2l74.88-100.48a24.064 24.064 0 0 0-38.464-28.8L798.72 402.24a489.92 489.92 0 0 0-147.84-63.808l36.096-104.32a24 24 0 0 0-45.248-15.744L603.52 328.512a581.12 581.12 0 0 0-91.392-7.488 590.08 590.08 0 0 0-83.84 6.272l-37.824-109.44a23.936 23.936 0 1 0-45.312 15.744l35.712 103.04a497.984 497.984 0 0 0-148.48 61.76l-72.128-96.64a24.064 24.064 0 0 0-38.528 28.8L193.28 426.24c-52.16 42.122-89.792 94.4-106.688 152.192l1.408 0.384-1.024 0.32c42.88 146.56 219.328 247.424 426.048 247.872 207.104-0.384 383.872-101.696 426.24-248.768l-1.152-0.384z m-424.96 201.088c-185.472 0.384-337.28-90.122-376.064-200.704 39.488-111.616 191.232-209.792 375.104-209.28 185.28-0.512 338.122 98.368 376.384 210.88-39.808 109.888-190.976 199.488-375.488 199.04z m1.856-342.08a140.096 140.096 0 1 0-0.064 280.128 140.096 140.096 0 0 0 0-280.128z m0 232.192a92.224 92.224 0 0 1-92.16-92.16 92.224 92.224 0 0 1 92.16-92.032 92.224 92.224 0 0 1 92.096 92.096 92.288 92.288 0 0 1-92.16 92.096z" p-id="7158" fill="#999999"></path>')

  } else {
    $(this).parent().find('input').attr("type", "password");
    $(this).parent().find('input').removeAttr('readonly');
    $(this).html('<path d="M814.08 541.83936l-65.37216-77.63968a327.2704 327.2704 0 0 0 61.29664-85.8122c4.096-8.192 0-20.45952-8.192-28.63104-8.15104-4.096-20.41856 0-28.59008 8.192-49.02912 102.15424-151.20384 163.45088-261.5296 163.45088-110.36672 0-212.52096-61.29664-261.57056-159.37536-4.096-12.26752-16.34304-16.34304-28.61056-8.192-8.17152 4.096-12.24704 16.36352-8.17152 24.53504 16.34304 32.68608 36.78208 57.22122 61.29664 81.73568l-65.37216 77.63968c-8.192 8.192-4.096 20.43904 4.096 28.61056 4.07552 4.096 8.15104 4.096 12.24704 4.096 4.096 0 12.24704-4.096 16.34304-8.192l61.29664-73.54368c20.43904 16.34304 40.87808 28.61056 65.39264 40.8576l-32.68608 94.0032c-4.096 12.26752 0 20.43904 12.24704 24.51456h8.192c8.15104 0 16.32256-4.096 20.41856-12.24704l32.68608-94.0032c24.53504 12.26752 53.12512 16.34304 81.73568 20.43904v94.0032c0 12.24704 8.192 20.41856 20.43904 20.41856 12.26752 0 20.43904-8.17152 20.43904-20.43904v-94.0032c28.61056 0 57.20064-8.15104 85.8122-16.32256l32.70656 89.9072c4.096 8.17152 12.24704 12.24704 20.41856 12.24704h8.192c12.24704-4.096 16.34304-16.34304 12.24704-24.51456l-32.68608-94.0032c24.51456-12.24704 44.9536-24.51456 65.39264-40.8576l65.37216 77.63968c4.096 4.096 8.192 8.192 16.34304 8.192 4.096 0 8.192 0 12.288-4.096 0-8.192 4.07552-20.43904-4.096-28.61056z" fill="#999999" p-id="6650"></path>')
  }
}

//密码相同
function pwdIsSame(pwd, pwd2) {
  return (pwd === pwd2)
}

//密码格式错误
function pwdIsVailable(pwd) {
  //6-16非空字符，区分大小写
  let reg = new RegExp('^.{6,16}$');
  //有个bug
  return (reg.test(pwd));
}


//设置成成功信息

//判断用户名是否合法: 1-15位非空格字符
function userNameIsAvailable(userName) {
  let reg = /^\S{1,15}$/;
  return reg.test(userName);
}

export {statusDisplay ,isEmpty, clearErrorMessage, isEmailAvailable, getUserType, dataIsExiste, forbidSendConfirm, judgeCode, changeToNextPage,
animationDisplay, animationSlide_major, animationSlide,viewChange, pwdIsSame, pwdIsVailable,userNameIsAvailable }