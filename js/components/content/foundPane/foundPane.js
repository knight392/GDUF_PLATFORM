import {selectObjectType, submite_found, readFile_found} from './tool.js'
import {initCalendar, bindSelectDayEvent} from '../calendar/calendar.js'
 $(".modal_bg_found .objClass_entrance").on("mouseenter",function(){
    $(this).find(".objClassPane").stop().fadeIn(200);
})
$(".modal_bg_found .objClass_entrance").on("mouseleave",function(){
    $(this).find(".objClassPane").stop().fadeOut(200);
})
// 选择物品类型
$(".modal_bg_found .objClass .item").on("click", selectObjectType);

// 设置月历
initCalendar('#calendar_found');
// 绑定选择日期事件
bindSelectDayEvent("#calendar_found", function (){
  const year = $('#calendar_found').data('year');
  const month = $('#calendar_found').data('month');
  const day = $(this).html();
  const timeBox = $('#foundTimeBox');
  timeBox.find('.yearNum').html(year)
  timeBox.find(".time_display").css("display","inline-block")
  timeBox.find('.monthNum').html(month)
  timeBox.find('.dayNum').html(day)
})

 //月历的显示与隐藏
 $(".modal_bg_found .calendar_entrance").on("mouseenter",function(){
    $(this).find("#calendar_found").stop().fadeIn();
})
$(".modal_bg_found .calendar_entrance").on("mouseleave",function(){
    $(this).find("#calendar_found").stop().fadeOut();
})

//点击地点进行选择
$(".modal_bg_found .areaPane .item").on("click",function(){
    $(this).parents(".value").find(".text").html($(this).html());
    $(this).parents(".areaPane").fadeOut(200);
    $(this).parents(".value").find(".areaDetail").val("");
    $(this).parents(".value").find(".areaDetail").css("display","inline-block");
});
$(".modal_bg_found .area").on("mouseenter",function(){
    $(this).find(".areaPane").stop().fadeIn(200);
});
$(".modal_bg_found .area").on("mouseleave",function(){
    $(this).find(".areaPane").stop().fadeOut(200);
});

//读取图片文件 

$(".modal_bg_found .addPic .addBtn").on("click",function(){
    $(this).parents(".addPic").find("input").click();
})


$('.modal_bg_found .addPic input').change(readFile_found);

// 一键发布
$(".modal_bg_found .sendBtn").on("click",submite_found);
//关闭面板

$(".modal_bg_found .fadeout_foundModal").on("click",function(){
    $(".modal_bg_found").fadeOut();
})
//可以重用
