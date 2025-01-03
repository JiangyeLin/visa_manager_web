//转换成中国时间
export function convertToChinaTime(utcTimeString) {
    // 将时间字符串转换为 UTC 时间对象
    const utcDate = new Date(utcTimeString);

    // 检查日期是否有效
    if (isNaN(utcDate.getTime())) {
        throw new Error("无效的时间字符串");
    }

    // 使用 `Intl.DateTimeFormat` 格式化为中国时间
    const options = {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };

    const formatter = new Intl.DateTimeFormat("zh-CN", options);

    // 格式化后的结果
    const formattedDate = formatter.format(utcDate);
    return formattedDate.replace(/\//g, "-").replace(", ", " ");
}

//防抖函数
export function   debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
