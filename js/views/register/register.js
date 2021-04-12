import { baseHttpURL } from '../../common/baseRequestInfo.js';
import request from '../../util/request.js';
import {displayTipPane_success, displayTipPane_warn, displayTipPane_err} from '../../components/content/tipPane.js'
import {time,statusDisplay ,isEmpty, clearErrorMessage, isEmailAvailable, dataIsExiste,forbidSendConfirm, judgeCode, changeToNextPage,
animationDisplay, animationSlide_major, animationSlide, viewChange, pwdIsSame, pwdIsVailable, userNameIsAvailable } from './tools.js'
//发送验证码 每60s发一次

//禁用 倒计时 disable属性

//验证码
const requestData = {
  email: "", //发送请求的邮箱
  requestType: "get"
}
// let markNumber = null; //学号或教工号
let email = null; //注册成功后的最终邮箱
let userType = 'student'; //用户类型。student / teacher
//清除原来的输入框的缓存
$('input[type=text]').val('');
//点击后开始发送请求，禁用按钮,开始定时器

//设置一些输入框样式
$('.email_input').on("focus", function () {
  clearErrorMessage($('.email_input'));
});
$('.confirm_input').on("focus", function () {
  clearErrorMessage($('.confirm_input'));
});
$('.input_text_page1').bind('focus', function () {
  $(this).addClass('editing');
});
$('.input_text_page1').bind('blur', function () {
  $(this).removeClass('editing');
});

//身份展示

//身份选择
$('.individual').bind("click", function () {
  $('.status').removeClass('status_display');
  $('.status header').fadeIn();
  $('.status .content').fadeOut();
  $('.status header').find('.text').html(
    $(this).find('.individual_inner').clone()
  );
  if ($(this).attr('id') == 'student') {
   userType = 'student'
  } else {
    userType = 'teacher'
  }
})
//身份切换
$('.alter').bind("click", function () {
  $('.status').addClass('status_display');
  statusDisplay();
})


//发送验证码的逻辑
//定时器做的工作，减少数字，显示数字，当time==0时，清除定时器，并且把按钮重新恢复，并改变内容
$('.send_btn').click(function () {
  if (time == 0 && !isEmpty($('.email_input'), "邮箱禁止为空哦~") && isEmailAvailable("邮箱格式有误！")) {
    requestData.email = $('.email_input').val();
    //判断数据是否存在
    dataIsExiste('email', requestData.email, userType).then(res => {
      // 200 存在 | 500 不再
      if (res == true) {
        displayTipPane_warn('该邮箱已被注册！')
      } else {
        request(`${baseHttpURL}/Servlet/VerifyCodeServlet`, {
          method: 'get',
          body: {
            email: requestData.email,
            requestType: 'get'
          }
        }).then(res => {
          displayTipPane_success('发送成功，请注意查收！');
          forbidSendConfirm();
        }, err => {
          displayTipPane_err('发送失败，请重新发送！');
        })
      }
    })
  }
})


//输入判空
/**
 * 邮箱判空 输入的val()判断 ""
 * 非空则发送，否则就就显示邮箱不能为空在placeholder里设置，当输入后又把原来的placeholder换回来
 */
//下一步
//验证
//不能为空
//发送请求，获得后端返回验证码，进行匹配


/**角色选择 */
/**
 * 下拉 + 消失
 *      一开始是点击整个框就下拉,事件取消，==null
 * 第一次选好后
 *      把修改加上，并且当作为下一次下拉的唯一按钮
 *
 * 收起
 * 点击角色后，收起 + 消失
 *
 * 角色变成刚选定的
 */
//拿取本页的数据有:邮箱，身份，学号,
//身份时候获取？验证成功后获取

//身份:根据最后的邮箱后缀是否有以m.开头，不能根据选择来获取，因为用户可能会发送完邮箱后又修改身份


//  let temp_email = requestData.email.split('@');




//点击进入下一步注册逻辑
$(".next_btn").click(async function () {
  if (!isEmpty($('.email_input'), "邮箱禁止为空哦~") && !isEmpty($('.confirm_input'), "验证码禁止为空哦~")) {
    email = requestData.email; //不能再次获取
    const code = $('.confirm_input').val();
    if(await judgeCode( {code,requestType: 'get'})){
      if (userType == 'student') {
        //换到学生注册面
        changeToNextPage('#form_student');
      } else {
        //换到老师注册面
        changeToNextPage('#form_teacher');
      }
    }else {
      displayTipPane_err("验证码有误，注意区分大小哦~")
      $('.confirm_input').addClass('error');
    }
  } 
})


//注册的下一步操作*********************************************************

let $pwd_view = false;
let $pwd_confirm_view = false;


//输入框悬浮时激活线变长
$(".form .row .value input").on("focus", function () {
  $(this).parents(".row").find(".active_line").animate({
    width: "310px"
  }, 300)
})
$(".form .row .value input").on("blur", function () {
  $(this).parents(".row").find(".active_line").animate({
    width: "0px"
  }, 300)
})


animationDisplay('.sex', '.male', '.female');
animationDisplay('.campus', '.headquarter', '.Zhaoqing');
animationSlide('#grade', 120);//高度固定
animationSlide('.college', 240);
animationSlide_major('.major');//高度变化
animationSlide("#degree", 120);
//不同的专业，高度不一样

//专业信息

//密码可视化
$('.pwd svg').click(function () {
  viewChange.call($(this), $pwd_view);
  $pwd_view = $pwd_view == false ? true : false;
})
$('.pwd_confirm svg').click(function () {
  viewChange.call($(this), $pwd_confirm_view);
  $pwd_confirm_view = $pwd_confirm_view == false ? true : false;
})



//用户名合法性判断
$('.userName input').blur(function () {
  $('.userName .success_icon').css("display", "none");
  if (!userNameIsAvailable($(this).val())) {
    displayTipPane_warn('用户名格式有误！');
  } else {
    dataIsExiste('userName', $(this).val(), '该用户名已存在！');
  }
})

//模态框关闭
$('.fadeOut').click(function () {
  $('.modal_bg').fadeOut();
})

//数据提交
$('.submit_btn').click(() => {
  //学号是自动填充，但是教工号用户自己写的，根据userType来进行选择，
  //学号或教工号，待定。。
  let markNumber
  if (userType == 'teacher') {
    //教工号判空
    if ($('#markNumber_teacher input').val() == '') {
      displayTipPane_warn("请填写您的教工号！");
      return;
    }
    markNumber = $('#markNumber_teacher input').val();
    //用户名判空
    if ($('.userName input').eq(1).val() == '') {
      displayTipPane_warn('请输入您的用户名！');
      return;
    }

    //性别判空
    if ($('.sex .value').eq(1).attr('data') == '') {
      displayTipPane_warn('请选择您的性别！');
      return;
    }
    //学院判空
    if ($('.college .value').eq(1).attr('data') == '') {
      displayTipPane_warn('请选择您所属的学院！');
      return;
    }

  } else {
    //学生学号
    if ($('#markNumber_student input').val() == '') {
      displayTipPane_warn("请填写您的学号！");
      return;
    }
    markNumber = $('#markNumber_student input').val();
    console.log(markNumber);
    //用户名判空
    if ($('.userName input').eq(0).val() == '') {
      displayTipPane_warn('请输入您的用户名！');
      return;
    }
    //性别判空
    if ($('.sex .value').eq(0).attr('data') == '') {
      displayTipPane_warn('请选择您的性别！');
      return;
    }

    //年级判空
    if ($('#grade .value').attr('data') == '') {
      displayTipPane_warn('请选择您所在年级！');
      return;
    }

    //学院判空
    if ($('.college .value').eq(0).attr('data') == '') {
      displayTipPane_warn('请选择您所属的学院！');
      return;
    }
    //专业判空
    if ($('.major .value').attr('data') == '') {
      displayTipPane_warn('请选择您的专业！');
      return;
    }
  }


  //校区判空
  if ($('.campus .value').eq(0).attr('data') + $('.campus .value').eq(1).attr('data') == '') {
    displayTipPane_warn('请选择您现所属的校区！');
    return;
  }

  //密码判空
  if ($('.pwd input').eq(0).val() + $('.pwd input').eq(1).val() == '') {
    displayTipPane_warn('密码禁止为空！');
    return;
  }

  //密码有效性判断
  if (!pwdIsVailable($('.pwd input').eq(1).val() + $('.pwd input').eq(0).val())) {
    displayTipPane_warn('密码格式错误！');
    return;
  }
  //确认密码判空
  if ($('.pwd_confirm input').eq(0).val() + $('.pwd_confirm input').eq(1).val() == '') {
    displayTipPane_warn('请输入确认密码！');
    return;
  }

  //密码一致判断
  if (!pwdIsSame($('.pwd input').eq(0).val() + $('.pwd input').eq(1).val(), $('.pwd_confirm input').eq(0).val() + $('.pwd_confirm input').eq(1).val())) {
    displayTipPane_warn('密码前后不一致！');
    return;
  }

  const formData = {
    "markNumber": markNumber,
    "password": $('.pwd input').eq(0).val() + $('.pwd input').eq(1).val(),
    "userType": userType,
    "email": email,
    "level": $('#grade .value').attr('data'),
    "college": $('.college .value').attr('data'),
    "major": $('.major .value').attr('data'),
    "requestType": "post",
    "sex": $('.sex .value').attr('data'),
    "userName": $('.userName input').eq(0).val() + $('.userName input').eq(1).val(),
    "area": $('.campus .value').attr('data'),
    "graduatedUniversity": $('#graduatedUniversity input').val(),
    "degree": $('#degree .value').attr('data')
  }
  request(baseHttpURL+'/Servlet/UserServlet', {
    method:'post',
    body: formData
  }).then(res => {
    if(res.statusCode === 200 ){
      displayTipPane_success('恭喜，注册成功，您现可以登录正常使用啦~');
      setTimeout(() => {
        // 回退到上一个打开页面
        history.back();
      }, 2000);
    }else{
      displayTipPane_err("天啦撸，遇到了未知原因注册失败了~~")
    }
  }, err => {
    displayTipPane_err("天啦撸，网络遇到问题请重试~~")
  })
})














