export const GetYearAndMonth = (year: number, month: number, today: number, close_day: number, pay_day: number) => {
  // 給与日が月をまたぐ場合
  if (pay_day - close_day < 0) {
    if (today > close_day) {
      if (month === 11) {
        month = 1;
        year += 1;
      } else if (month === 12) {
        month = 2;
        year += 1;
      } else {
        month += 2;
      }
    } else {
      if (month === 12) {
        month = 1;
        year += 1;
      } else {
        month += 1
      }
    }
  // 給与日が月をまたがない場合
  } else {
    if (today > close_day) {
      if (month === 12) {
        month = 1;
        year += 1;
      } else {
        month += 1;
      }
    } else {
      month = month;
      year = year
    }
  }
  return [year, month]
}
