export default function getLink(url) {
  let createInput = document.createElement("input");
  createInput.value = decodeURI(url);
  document.body.appendChild(createInput);
  createInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  alert('复制成功')
  createInput.remove();
}