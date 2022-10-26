/**
 * firebaseErrorTransition
 * @param code any
 * @returns string
 */
export const firebaseErrorTransition = (error: any) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません。';
    case 'auth/user-disabled':
      return 'サービスの利用が停止されています。';
    case 'auth/user-not-found':
      return 'メールアドレスまたはパスワードが違います。';
    case 'auth/user-mismatch':
      return '認証されているユーザーと異なるアカウントが選択されました。';
    case 'auth/weak-password':
      return 'パスワードは6文字以上にしてください。';
    case 'auth/wrong-password':
      return 'メールアドレスまたはパスワードが違います。';
    case 'auth/popup-blocked':
      return '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください。';
    case 'auth/operation-not-supported-in-this-environment':
    case 'auth/auth-domain-config-required':
    case 'auth/operation-not-allowed':
    case 'auth/unauthorized-domain':
      return '現在この認証方法はご利用頂けません。';
    case 'auth/requires-recent-login':
      return '認証の有効期限が切れています。';
    default:
      return '認証に失敗しました。しばらく時間をおいて再度お試しください。';
  }
}

/**
 * error
 */
export const errorCode = {
  passwordNotMatch: 'パスワードが一致していません。'
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