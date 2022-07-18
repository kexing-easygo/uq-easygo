import Taro from "@tarojs/taro";
import { APPID, RESOURCE_APP_ID, RESOURCE_ENV, BRANCH_NAME } from "./constant";

export const initCloud = async () => {
  Taro.cloud.init({
    env: "cloudbase-prepaid-8eqh90441a925f"
  });
  var c1 = new Taro.cloud.Cloud({
    appid: APPID,
    // 资源方 AppID
    resourceAppid: RESOURCE_APP_ID,
    // 资源方环境 ID
    resourceEnv: RESOURCE_ENV
  });
  await c1.init();
  Taro.$masterCloud = c1;
};

/**
 * 调用云函数
 * @param {string} name
 * @param {string} method
 * @param {object} args
 * @param {string} branch
 */
export const callCloud = async (name, method, args = {}) => {
  const _data = {
    method: method,
    branch: BRANCH_NAME
    // branch: "Test"
  }
  switch (BRANCH_NAME) {
    case "UQ":
      return await Taro.cloud.callFunction({
        name: name,
        data: {
          ..._data,
          ...args
        }
      });
    default:
      return await Taro.$masterCloud.callFunction({
        name: name,
        data: {
          ..._data,
          ...args
        }
      });
  }
};
