//CheckPassWord function 检查密码的格式 没有用到
//忘记密码 验证码验证 重置密码 没有与后端交互

import { displayTipPane_warn, tipInfo } from "../tipPane.js";
import {logon} from './tools.js'

// import CheckPassWord from './tools.js';
    // 点击表单 表单本身的提示语句span.tip 缩小上移
    $(".confirm input").on("focus", function() {
        $(this).siblings('.tip').animate({
            bottom: "90%"
        }, 100)
        $(this).siblings(".tip").css("color", "#000");
    })

    //表单失去光标 且表单内无值 表单提示语句span.tip回到原来状态 
    $(".confirm input").on("blur", function() {
        if ($(this).val() == '') {
            $(this).siblings(".tip").animate({
                bottom: "5%"
            }, 100)
        }
        // else {
        // const value = $(this).val();
        // }

        $(this).siblings(".tip").css("color", "#555");
    })

    $(".fadein").on({
        click: function() {
            console.log('fadein');
            $(".tip").css({
                bottom: "5%"
            })
            $(".tip").css("color", "#555");
            $('.logonBody input').val("");
            // $(".logonBody .modal_head b").text("用户登录")
        }
    })

    // 点击登录
    $('.btnLogon').click(function() {
      logon();
  })
  

    //#region 点击 超链接/按钮 转换页面+邮箱的后缀名

    //1.点击 登录页面的 忘记密码?.aForgetPas 登录页面.logOn 换成  忘记密码界面.forgetPas
    $(".aForgetPas").on("click", function() {
      console.log('点击');
      displayTipPane_warn(tipInfo.dev.mes)
        // $('.logonTitle').text("忘记密码");
        
        // $(".chooseStudent").prop("checked", "true"); //点击 忘记密码 默认选择 学生 htmld就不用写了
        // $(".logOn").fadeOut();
        // $(".forgetPas").fadeIn();
    })

    //单选框 如果选择学生 后缀名 多了一个m. if教师 就少 切换的时候 清空原来表单有的数据 
    // let chooseY = $(".chooseStudent").prop("checked") ? "student" : "teacher";
    // $(".teacherOrStudent label").on("click", function() {
    //     $(this).siblings().find("input").prop("checked", "false");
    //     $(this).find("input").prop("checked", "true");
    //     if ($(".chooseStudent").prop("checked")) {
    //         if (chooseY != "student") {
    //             $(".inEmail").val("");
    //         }
    //         chooseY = "student";
    //         $(".emailSuffix").text("m.gduf.edu.cn");
    //     } else {
    //         if (chooseY != "teacher") {
    //             $(".inEmail").val("");
    //         }
    //         chooseY = "teacher";
    //         $(".emailSuffix").text("gduf.edu.cn");
    //     }
    // })

    // //2.点击 忘记密码页面的 下一步.forgetPasNext 忘记密码页面.forgetPas 转换成 重置密码页面.resetPas 
    // $(".forgetPasNext").on("click", function() {
    //     $('.logonTitle').text("重置密码");
    //     $(".forgetPas").fadeOut();
    //     $(".resetPas").fadeIn();
    // })

    // //3.点击 忘记密码页面的 上一步.forgetPasLast 忘记密码页面.forgetPas 转换成 登录页面.logon 
    // $(".forgetPasLast").on("click", function() {
    //     $('.logonTitle').text("用户登录");
    //     $(".forgetPas").fadeOut();
    //     $(".logOn").fadeIn();
    // })

    // //4.点击 重置密码页面的 确定.resetPasConfirm 模态框消失
    // $(".resetPasConfirm").on("click", function() {
    //     $('.logonTitle').text("用户登录");
    //     $(".logOn").siblings().fadeOut();
    //     $(".logOn").fadeIn();
    // });
    //#endregion

    //#region  点击模态框以外的地方 模态框消失
    $(".modal_bg_logon").on({
        click: function() {
            $('.modal_bg_logon').fadeOut(); // 其实就是css 的过渡+ display
            $('.modal').css({
                transform: 'translate(-50%,-50%) scale(0.7)'
            })
        }
    });

    $(".modal").on({
        click: function(e) {
            e.stopPropagation();
        }
    });
    //#endregion
