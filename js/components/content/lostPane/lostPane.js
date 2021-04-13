 // 物品类型
 import {readFile_lost, submit_lost, searchFound, selectObject} from './tool.js'
 import {initCalendar, bindSelectDayEvent} from '../calendar/calendar.js'
 import debounce from '../../../util/debounce.js'
 
 $(".modal_bg_lost .objClass_entrance").on("mouseenter",function(){
    $(this).find(".objClassPane").stop().fadeIn(200);
})
$(".modal_bg_lost .objClass_entrance").on("mouseleave",function(){
    $(this).find(".objClassPane").stop().fadeOut(200);
})
$(".modal_bg_lost .objClass .item").on("click", selectObject);
// 初始化一个日历
initCalendar('#calendar_lost');
// 绑定选择时间事件
bindSelectDayEvent('#calendar_lost',  function (){
  const year = $('#calendar_lost').data('year');
  const month = $('#calendar_lost').data('month');
  const day = $(this).html();
  const timeBox = $('#lostTimeBox');
  timeBox.find('.yearNum').html(year)
  timeBox.find(".time_display").css("display","inline-block")
  timeBox.find('.monthNum').html(month)
  timeBox.find('.dayNum').html(day)
})
 //月历的显示与隐藏
 $(".modal_bg_lost .calendar_entrance").on("mouseenter",function(){
    $(this).find(".calendar").stop().fadeIn();
})
$(".modal_bg_lost .calendar_entrance").on("mouseleave",function(){
    $(this).find(".calendar").stop().fadeOut();
})

//点击地点进行选择
$(".modal_bg_lost .areaPane .item").on("click",function(){
    $(this).parents(".value").find(".text").html($(this).html());
    $(this).parents(".areaPane").fadeOut(200);
    $(this).parents(".value").find(".areaDetail").val("");
    $(this).parents(".value").find(".areaDetail").css("display","inline-block");
});
$(".modal_bg_lost .area").on("mouseenter",function(){
    $(this).find(".areaPane").stop().fadeIn(200);
});
$(".modal_bg_lost .area").on("mouseleave",function(){
    $(this).find(".areaPane").stop().fadeOut(200);
});

//读取图片文件 

$(".modal_bg_lost .addPic .addBtn").on("click",function(){
    $(this).parents(".addPic").find("input").click();
})
$('.modal_bg_lost .addPic input').change(readFile_lost);




// 输入物品名称后进行模糊查询

$('.modal_bg_lost .objName .value').on("input",debounce(function(){
    searchFound($(this).val());
},500))


// 匹配面板消失，取消冒泡
$(".modal_bg_lost").on("click",function(){
    $(this).find(".search_display").fadeOut();
})
$(".modal_bg_lost .search_display").on("click",function(e){
    e.stopPropagation();
    e.cancelBubble = true;
})
$('.modal_bg_lost .objName .value').on("click",function(e){
    e.stopPropagation();
    e.cancelBubble = true;
})



// 一键发布
$(".modal_bg_lost .sendBtn").on("click",submit_lost);
//关闭面板

$(".modal_bg_lost .fadeout_lostModal").on("click",function(){
    $(".modal_bg_lost").fadeOut();
})


