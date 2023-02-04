/**
 * firebaseErrorTransition
 * @param error any
 * @return string
 */
export const firebaseErrorTransition = (error: any) => {
  var errorMessage: string[] = [];
  switch (error.code) {
    case 'auth/email-already-in-use':
      errorMessage.push('このメールアドレスは既に使用されています。');
      break;
    case 'auth/weak-password':
      errorMessage.push('パスワードは6文字以上です。');
      break;
    case 'auth/invalid-email':
      errorMessage.push('メールアドレスの形式が正しくありません。');
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      errorMessage.push('メールアドレスまたはパスワードが違います。');
      break;
    case 'auth/user-mismatch':
      errorMessage.push('認証されているユーザーと異なるアカウントが選択されました。');
      break;
    case 'auth/operation-not-supported-in-this-environment':
    case 'auth/auth-domain-config-required':
    case 'auth/operation-not-allowed':
    case 'auth/unauthorized-domain':
      errorMessage.push('現在この認証方法はご利用頂けません。');
      break;
    case 'auth/requires-recent-login':
      errorMessage.push('認証の有効期限が切れています。');
      break;
    default:
      errorMessage.push('認証に失敗しました。しばらく時間をおいて再度お試しください。');
      break;
  }

  return errorMessage
}

/**
 * errorCodeTransition
 * @param code any
 * @return string
 */
export const errorCodeTransition = (codes: string[]) => {
  var errorMessage: string[] = [];
  console.log("codes", codes);
  codes.forEach(code => {
    console.log(code);
    console.log(errorMessage);
    switch (code) {
      case 'user_auth_error':
      case 'user_not_sigin':
      case 'user_not_match':
      case 'uuid_null_error':
        errorMessage.push('ユーザー認証に失敗しました。再度ログインしてください。');
        break;
      case 'uuid_duplicate_error':
        errorMessage.push('既に存在するユーザーです。ログインしてください。');
        break;
      case 'password_not_match':
        errorMessage.push('パスワードが一致していません。');
        break;
      case 'password_null_error':
        errorMessage.push('現在のパスワードを入力してください');
        break;
      case 'invalid_email':
        errorMessage.push('メールアドレスの形式が正しくありません。');
        break;
      case 'body_parse_error':
        errorMessage.push('情報処理に失敗しました。しばらく時間をおいてから再度試してください。');
        break;
      case 'follow_relationship_error':
        errorMessage.push('フォローの解除・フォロワーの解除を実施してください。');
        break;
      // validation error
      case 'nickname_null_error':
        errorMessage.push('ニックネームを入力してください。');
        break;
      case 'nickname_letter_count_error':
        errorMessage.push('ニックネームの文字数が無効です。3〜30文字です。');
        break;
      case 'prefecture_null_error':
        errorMessage.push('営業区域を入力してください');
        break;
      case 'company_null_error':
        errorMessage.push('所属会社を入力してください。');
        break;
      case 'style_flg_null_error':
        errorMessage.push('業務形態を選択してください。');
        break;
      case 'specified_word_error(style_flg)':
        errorMessage.push('業務形態に無効な文字が含ませています。再度選択してください。');
        break;
      case 'close_day_date_error':
        errorMessage.push('締め日に無効な値が入力されています。1〜31の整数を入力して下さい。');
        break;
      case 'day_of_week_null_error':
        errorMessage.push('曜日を選択してください');
        break;
      case 'pay_day_date_error':
        errorMessage.push('給与日に無効な値が入力されています。1〜31の整数を入力して下さい。');
        break;
      case 'start_hour_number_error':
        errorMessage.push('業務開始時刻に無効な値が入力されています。0〜24の整数を入力して下さい。');
        break;
      case 'running_time_number_error':
        errorMessage.push('走行時間に無効な値が入力されています。0〜24の整数を入力して下さい。');
        break;
      case 'running_km_number_error':
        errorMessage.push('走行距離に無効な値が入力されています。0以上の整数を入力して下さい。');
        break;
      case 'number_of_time_number_error':
        errorMessage.push('乗車率に無効な値が入力されています。0以上の整数を入力して下さい。');
        break;
      case 'occupancy_rate_number_error':
        errorMessage.push('乗車率に無効な値が入力されています。0〜100の数値（少数可）を入力して下さい。');
        break;
      case 'daily_sales_number_error':
        errorMessage.push('売上に無効な値が入力されています。0以上の整数を入力して下さい。');
        break;
      default:
        errorMessage.push('システムエラーが発生しました。運営に問い合わせてください。');
        break;
    }
  });
  return errorMessage  
}

/**
 * errorCode
 */
export const errorCode = {
  PASSWORD_NOT_MATCH: 'password_not_match',
}

/**
 * method
 */
export const method = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
}