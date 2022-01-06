import { WebView } from "@tarojs/components";
import { activityUrl } from "../../config.json";

export default function officialAccountWebView(props) {
  return (
    <WebView src={activityUrl} />
  )
}