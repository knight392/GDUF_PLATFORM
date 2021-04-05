//必须为字母加数字且长度不小于8位
export function CheckPassWord(password) {
    const str = password;
    if (str == null || str.length != 9) {
        return false;
    }
    const reg1 = new RegExp(/^[0-9A-Za-z]+$/);
    if (!reg1.test(str)) {
        return false;
    }
    return true;
}