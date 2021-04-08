"use strict";
//平年和闰年的月的天数
const months = [[0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
[0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]];

let base_year = 2000;
let base_week = 6;

//然后计算当前年的 1月1日是星期几
//再计算当前月的1日是什么是星期几
//计算闰年
function isLeapYear(year) {
  //4的倍数但不是100的倍数 或者400的倍数
  if ((year % 4) == 0 && (year % 100) != 0 || (year % 400) == 0) {
    return 1;
  }
  return 0;
}

// sun | mon | tue | wed | tus | fri | stu 
// 返回一个6行7列的二维月天数数组并且日期开始的位置依据星期而定
export default function getCalendarData(year, month) {
  //6行7列
  const calendar = [[], [], [], [], [], []];
  let nextPosition = 0;

  // 从当前年的1月1到当前月之前的总共的天数
  let totalDay_month = 0;
  // 从 基础年到要求的年之前的总共天数
  let totalDay_year = 0;
  // 当前年的第一天是星期几
  let year_first = 0;
  // 当前月的第一天是星期几
  let month_first = 0;
  for (let i = base_year; i < year; i++) {
    totalDay_year += (365 + isLeapYear(i));
  }
  for (let i = 1; i < month; i++) {
    totalDay_month += months[isLeapYear(year)][i];
  }
  year_first = (totalDay_year + base_week) % 7;
  month_first = (totalDay_month + year_first) % 7;
  // 第一行不是从第一格开始，因为1号不一定是星期日
  for (let i = 0; i < month_first; i++) {
    calendar[0][i] = "";
    nextPosition++;
  }
  //填日数
  for (let day = 1; day <= months[isLeapYear(year)][month]; day++) {
    //求出下一个填充的位置
    let row = Math.floor(nextPosition / 7);
    let column = nextPosition % 7;
    calendar[row][column] = day;
    nextPosition++;
  }
  return calendar;
}