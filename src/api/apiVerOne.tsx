import axios from "axios";
import { server } from "../utils/constHide";

axios.defaults.baseURL = server.baseUrl;

/**
 * apiVerOne
 * apiアクセス
 * @param method string
 * @param url string
 * @param header any
 * @param params any
 * @param data any
 */
export const apiVerOne = async (method: string, url: string, header: any, params: any, data: any) => {
  var resp: any;

  // apiの実施
  await axios({
    method: method,
    url: url,
    headers: header,
    data: data,
    params: params,
  }).then((response) => {
    resp = response.data;
    console.log("resp", response.data);
    return resp;
  }).catch(error => {
    console.log("error", error)
    return error.message;
  });
}