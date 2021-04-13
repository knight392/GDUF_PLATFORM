
import { doLogin, user, isLogin } from "../../../common/user/index.js";
import { displayTipPane_err, displayTipPane_success, displayTipPane_warn } from "../tipPane.js";

//必须为字母加数字且长度不小于8位
export function CheckPassWord(password) {
  const str = password;
  if (str == null || str.length != 9) {
    return false;
  }
  const reg1 = new RegExp(/^[0-9A-Za-z]+$/);
  if (!reg1.test(str)) {
    return false;
  }
  return true;
}
//登录
let option = 1;

$(".logOn h2").on("click", function () {
  //点击 学生/老师 相应模块 显示
  $(this).parent().addClass("logOnDisplay");
  $(this).parent().siblings().removeClass("logOnDisplay");

  //设置option 1/2 当前登录状态 1 学生 2 老师
  if ($(this).text() === "学生") {
    option = 1;
  } else if ($(this).text() === "教师") {
    option = 2;
  }
})

export async function logon() {
  let pwd, account, type;
  if (option == 1) {
    pwd = $('#stu_pwd').val();
    account = $('#stu_account').val();
    type = "student"
  } else {
    pwd = $('#teacher_pwd').val();
    account = $('#teacher_account').val();
    type = "teacher"
  }

  if (pwd === "" || account === "") {
    displayTipPane_warn('用户名/密码不能为空')
  } else {
    if (await doLogin({
      password: pwd,
      loginValue: account,
      requestType: 'get',
      userType: type
    })) {
      $('.modal_bg').fadeOut(); // 其实就是css 的过渡+ display
      $('.modal').css({
        transform: 'translate(-50%,-50%) scale(0.7)'
      })
      setUserPaneInfo();
      $('.personal').hide(100);
      $('.logonHeadPortrait').show(100);
      displayTipPane_success("登录成功！")
    } else {
      displayTipPane_err('登录失败！ 账号或密码有误！');
    }
  }
}
function setUserPaneInfo() {

  $('.ResUserName').text(user.userName);
  $('.ResUserName').prop("title", user.userName);
  $('.ResMarkNumber').text(user.markNumber);
  $('.ResMarkNumber').prop("title", user.markNumber);
  // USERID = res.markNumber;
  if (user.major) {
    $('.ResMessagePojoMajor').text(user.major);
    $('.ResMessagePojoMajor').prop("title", user.major);
  }
  $('.ResMessageFace').prop("src", user.face);
  $('.navHPY').prop('src', user.face);
}

export function dealWithUserPane() {
  if (isLogin()) {
    setUserPaneInfo();
    $('.logonHeadPortrait').show();
  } else {
    $('.personal').show();
  }
}