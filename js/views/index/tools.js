export const totime = function(time) {
    //直接用 new Date(时间戳) 格式转化获得当前时间
    const timestamp = new Date(time);

    //再利用拼接正则等手段转化为yyyy-MM-dd hh:mm:ss 格式
    return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
}