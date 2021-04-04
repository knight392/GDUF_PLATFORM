export default function getLink() {
  let createInput = document.createElement("input");
  createInput.value = decodeURI(location.href);
  document.body.appendChild(createInput);
  createInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  alert('复制成功')
  createInput.remove();
}