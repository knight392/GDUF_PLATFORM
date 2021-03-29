"use strict";

import getCalendar from './util.js'

// 设置样式
function setCalendar(year, month) {//设置展示样式
  const calendar = getCalendar(year, month);//日历数据
  let date_now = new Date();//用来判断是不是当前月
  let row = $("table .day");
  let table = [];
  for (let i = 0; i < row.length; i++) {
    table[i] = $(row[i]).children();
  }
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      $(table[i][j]).removeClass("fill");
      $(table[i][j]).removeClass("today");

      $(table[i][j]).html("");
      if (calendar[i][j] != "" && calendar[i][j] != null && calendar[i][j] != undefined) {
        $(table[i][j]).addClass("fill");
      }

      $(table[i][j]).html(calendar[i][j]);
      if (date_now.getFullYear() == year && (date_now.getMonth() + 1) == month && $(table[i][j]).html() == date_now.getDate()) {
        $(table[i][j]).addClass("today");
      }
    }
  }


  $(".calendar .day .fill").off("click");

  $(".calendar .day .fill").on("click", getTime);
  //标出当天
  //判断展示的年月是否和实际的年月相同


  // if(date_now.getFullYear()==year && (date_now.getMonth()+1)==month){
  //     console.log("相同")
  //     for(let i=0; i<6; i++){
  //         for(let j=0; j<7; j++){

  //         }
  //     }
  // }
  // console.log(table);
}
let date = new Date();
// console.log(date);
let nowYear = date.getFullYear();
// let 
let nowMonth = date.getMonth() + 1;
setYearMonth();

function setYearMonth() {
  $(".calendar").find(".year").html(nowYear);
  $(".calendar").find(".month").html(nowMonth);
}
// console.log(nowYear);
// console.log(nowMonth);


setCalendar(nowYear, nowMonth);

$(".switch_btn_calendar .up").click(function () {
  //上一个月
  nowMonth--;
  if (nowMonth < 1) {
    nowMonth = 12;
    nowYear--;
  }
  //2000年为基准年,不能求它小于日历
  setYearMonth();
  if (nowYear >= 2000) {
    setCalendar(nowYear, nowMonth);
  }
})
$(".switch_btn_calendar .down").click(function () {
  //上一个月
  nowMonth++;
  if (nowMonth > 12) {
    nowMonth = 1;
    nowYear++;
  }
  setYearMonth();
  //2000年为基准年,不能求它小于日历
  setCalendar(nowYear, nowMonth);

  // $(".calendar .day .flil").click(getTime)
})


//获取时间



function getTime() {
  // console.log(nowYear+"年"+nowMonth+"月"+$(this).html()+"日");
  $(".timeBox .time_display .yearNum").html(nowYear);
  $(".timeBox .time_display .monthNum").html(nowMonth);
  $(".timeBox .time_display .dayNum").html($(this).html());
  $(".calendar").fadeOut();
}





