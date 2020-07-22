from tencentcloud.common import credential
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
# 导入对应产品模块的client models
from tencentcloud.scf.v20180416 import scf_client,models



# 对应接口的接口名
action = 'Invoke'

# 接口参数,输入需要调用的函数名，RequestResponse(同步) 和 Event(异步)
action_params = {
    'FunctionName': "test",
    'InvocationType': "Event"
}

print('Start Hello World function')

def main_handler(event, context):
    try:
        # 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey
        cred = credential.Credential("AKIDAuObYUndR8cIjs8a8Ta6PTGn7C3hwhz8", "AzcptuLgqrHW4Sjtuk6LgYGpLfnlzqX3")

        # 实例化要请求产品的client对象，以及函数所在的地域
        client = scf_client.ScfClient(cred, "ap-guangzhou")

        # 调用接口，发起请求，并打印返回结果
        ret = client.call(action, action_params)

        print(json.loads(ret)["Response"]["Result"]["RetMsg"])

    except TencentCloudSDKException as err:
        print(err)