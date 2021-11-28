/**
 * 防抖，避免用户点击过多次执行网络请求，多次执行则重新计时
 * 
 * @param {function} callback 
 * @param {number} wait 
 */
export const debounce = (callback, wait = 300) => {
  let timer;
  return function () {
    let that = this,
      args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback.apply(that, args), wait);
  }
}

/**
 * 节流，在一段时间内频繁执行回调函数只有一次生效，计时内执行多次直接退出
 * 
 * @param {function} callback 
 * @param {number} wait 
 */
export const throttle = (callback, wait = 300) => {
  let timer;
  return function () {
    let that = this,
      args = arguments;
    if (timer) return; // quit function
    timer = setTimeout(() => {
      callback.apply(that, args);
      timer = null; // clear current timeout
    }, wait);
  }
}

/**
 * Promise实现sleep，避免直接调用setTimeout
 * @param {number} delay 
 */
export const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
