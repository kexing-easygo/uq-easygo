import { WebView } from "@tarojs/components";
import { carouselUrl } from "../../config.json";

export default function carouselWebView(props) {
  return (
    <WebView src={carouselUrl} />
  )
}