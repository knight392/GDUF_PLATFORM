"use strict";

import getCalendarData from './util.js'
// 每次加载都会获取当前的年和当前月



// 模块使用方法
// 1. 初始化当前时期
// 2. 绑定日历dom的attr of year and month
// 3. 初始化日历的初始日期
// 4. 绑定日历的上一个月和下一个月按钮的事件
/**
 * 
 * @param {*} calendarId 
 */
function initCalendar(calendarId) {
  const date = new Date();
  const nowYear = date.getFullYear();
  const nowMonth = date.getMonth() + 1;
  setCalendarAttrOfYearMonth(calendarId, nowYear, nowMonth);
  fillCalendarData(calendarId, nowYear, nowMonth);
  $(`${calendarId} .switch_btn_calendar .up`).on("click",() => { toLastMonth(calendarId) });
  $(`${calendarId} .switch_btn_calendar .down`).on("click",() => { toNextMonth(calendarId) });
}

// 设置填充某个月历中日期数据
function fillCalendarData(calendarId, year, month) {
  const calendar = getCalendarData(year, month);//根据年月获取月历数据
  const date_now = new Date(); // 用来判断是不是当前月
  const rows = $(`${calendarId} .day`); // 表格的多个行
  const table = []; // 二维表格保存着dom元素td,用来填充日期
  for (let i = 0; i < rows.length; i++) {
    table[i] = $(rows[i]).children();
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
  setYearMonth(calendarId, year, month)
  // 这里应用事件委派
  // $(".calendar .day .fill").off("click");
  // $(".calendar .day .fill").on("click", getTime);
}

// 设置月历的年和月
function setYearMonth(calendarId, year, month) {
  $(calendarId).find(".year").html(year);
  $(calendarId).find(".month").html(month);
}

// 到上一个月
function toLastMonth(calendarId) {
  let month = parseInt($(calendarId).data('month'));
  let year = parseInt($(calendarId).data('year'));
  month--;
  if (month < 1) {
    month = 12;
    year--;
  }
  //2000年为基准年,不能求它小于日历
  if (year >= 2000) {
    setCalendarAttrOfYearMonth(calendarId, year, month);
    fillCalendarData(calendarId, year, month);
  }
}



// 到下一个月
function toNextMonth(calendarId) {
  let month = parseInt($(calendarId).data('month'));
  let year = parseInt($(calendarId).data('year'));
  month++;
  if (month > 12) {
    month = 1;
    year++;
  }
  setCalendarAttrOfYearMonth(calendarId, year, month);
  fillCalendarData(calendarId, year, month);
}

// 设置calendarDom的year和month Attr
function setCalendarAttrOfYearMonth(calendarId, year, month) {
  $(calendarId).data('year', year);
  $(calendarId).data('month', month);
}


//获取时间
// function getTime() {
//   $(".timeBox .time_display .yearNum").html(nowYear);
//   $(".timeBox .time_display .monthNum").html(nowMonth);
//   $(".timeBox .time_display .dayNum").html($(this).html());
//   $(".calendar").fadeOut();
// }

// 绑定选择日期后的事件处理程序
function bindSelectDayEvent(calendarId, handler) {
  $(calendarId).click(function(event) {
    if(event.target.className == 'fill'){
      handler.call(event.target);
    }
  })
}


export { initCalendar, bindSelectDayEvent}




