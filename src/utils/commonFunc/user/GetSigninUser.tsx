import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { auth } from "../../../auth/firebase";
import { User } from "../../../models/User";
import { method } from "../../const";

export const GetSigninUser = async () => {
  console.log("start get signin user----------------------------------------------------------------")
  
  // uid取得
  var currentUser = auth.currentUser
  var uid: string
  if (currentUser) {
    uid = currentUser.uid
  } else {
    return false;
  }
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
    AsyncStorage.setItem("taxi_log_user_id", String(user.id));
    return true;
  }).catch(error => {
    console.log("error", error);
    // user情報取得失敗
    return false;
  });
  
  return true;
}