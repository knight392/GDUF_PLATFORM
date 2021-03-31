import { baseHttpURL } from '../../common/baseRequestInfo.js'
import request from '../../util/request.js'

let time = 0;
let timer = null;

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
function set_displayMessage(message, duration = 1200) {
  $('.modal_content').html(message);
  $('.modal_bg').fadeIn();
  setTimeout(() => {
    $('.modal_bg').fadeOut();
  }, duration)//默认2s
}

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

export { isEmpty, clearErrorMessage, isEmailAvailable, getUserType, dataIsExiste, set_displayMessage, forbidSendConfirm }