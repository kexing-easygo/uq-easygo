import { WebView } from "@tarojs/components";
import Taro from '@tarojs/taro'
export default function officialAccountWebView(props) {

  const url = Taro.$instance.router.params?.url
  console.log(url)
  return (
    <WebView src={url} />
  )
}