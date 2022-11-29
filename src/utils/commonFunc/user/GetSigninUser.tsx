import axios from "axios";
import { User } from "../../../models/User";
import { method } from "../../const";

export const GetSigninUser = async (uid: string) => {
  console.log("start get signin user----------------------------------------------------------------")
  // headers
  const headers = {'uuid': uid}
  await axios({
    method: method.GET,
    url: 'user/get_user_form_uid',
    headers: headers,
    data: null,
    params: null,
  }).then((response) => {
    var user: User = response.data.data
    console.log("user", user);
    return user;
  }).catch(error => {
    console.log("error", error);
    return "error";
  });
}