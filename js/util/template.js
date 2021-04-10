/**
 * 模板引擎替换函数
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export default function template(id, data) {
    let reg = /{{(\w+)}}/;
    id = "#" + id;
    let str = document.querySelector(id).innerHTML;
    let result = reg.exec(str);
    while (result != null) {
        //替换
        str = str.replace(result[0], data[result[1]]);
        result = reg.exec(str);
    }
    return str;
}