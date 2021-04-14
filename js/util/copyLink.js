import { displayTipPane_success } from "../components/content/tipPane.js";

export default function getLink(url) {
  let createInput = document.createElement("input");
  url = decodeURI(url)
  createInput.value = decodeURI(url);
  document.body.appendChild(createInput);
  createInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  displayTipPane_success("复制链接成功！")
  createInput.remove();
}