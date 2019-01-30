/**
 * code 对应
 */
const codeMessage = [
  { 200: "服务器成功返回请求的数据。" },
  { 201: "新建或修改数据成功。" },
  { 202: "一个请求已经进入后台排队（异步任务）。" },
  { 204: "删除数据成功。" },
  { 400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。" },
  { 401: "用户没有权限（令牌、用户名、密码错误）。" },
  { 403: "用户得到授权，但是访问是被禁止的。" },
  { 404: "发出的请求针对的是不存在的记录，服务器没有进行操作。" },
  { 406: "请求的格式不可得。" },
  { 410: "请求的资源被永久删除，且不会再得到的。" },
  { 422: "当创建一个对象时，发生一个验证错误。" },
  { 500: "服务器发生错误，请检查服务器。" },
  { 502: "网关错误。" },
  { 503: "服务不可用，服务器暂时过载或维护。" },
  { 504: "网关超时。" }
];

/**
 * 检查状态码
 * @param response
 */
const checkStatus = (response: any) => {
  // 不拦截
  if ((response.code >= 200 && response.code < 300) || response.access_token) {
    return response;
  }
  // 格式化text
  const msg =
    response.msg || codeMessage[response.code] || response.error_description;
  // message

  // 错误
  const error = new Error(msg);
  error.name = response.code;
  error.message = msg;
  throw error;
};
/**
 * @description 请求主体
 * @author jerrychir
 * @export
 * @param {*} url
 * @param {*} option
 */
export default async function request(url: any, option: any) {
  // 参数
  const options = { ...option };
  const defaultOptions = { credentials: "include" };
  const newOptions = { ...defaultOptions, ...options };
  //   请求方法判断
  if (
    newOptions.method === "POST" ||
    newOptions.method === "PUT" ||
    newOptions.method === "DELETE"
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        ...newOptions.headers
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: "application/json",
        ...newOptions.headers
      };
    }
  }
  return fetch(url, newOptions)
    .then(response => {
      return response.json();
    })
    .then(checkStatus)
    .catch(e => {
      const status = e.name;
      const msg = e.message;

      // 请求失败
      if (status === 401) {
        return;
      }
      // 禁止访问
      if (status === 403) {
        return;
      }
      // 内部错误
      if (status <= 504 && status >= 500) {
        return;
      }
      // 没有找到
      if (status === 404) {
      }
    });
}
