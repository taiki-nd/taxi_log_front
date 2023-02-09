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

/**
 * adjustmentCloseDay
 * 締め日の調整
 */
export const adjustmentCloseDay = (year: number, month: number) => {
  return new Date(year, month+1, 0).getDate()
}

/**
 * getMonthlyAnalysisPeriod
 */
export const getMonthlyAnalysisPeriod = (year: number, month: number, today: number, close_day: number, pay_day: number) => {
  var start_year: number
  var start_month: number
  var start_day: number
  var finish_year: number
  var finish_month: number
  var finish_day: number

  
  var close_day_next_month: number
  close_day_next_month = close_day

/*
  var close_day_start
  var close_day_finish

  var sales_period_start
  var sales_period_finish

  if (pay_day - close_day < 0) {
    // 開始期間の取得
    if (month === 1) {
      year -= 1;
      month = 11;
    } else if (month ===2) {
      year -= 1;
      month = 12;
    } else {
      month -= 2;
    }
    if (close_day === 31) {
      close_day_start = adjustmentCloseDay(year, month)
    } else {
      close_day_start = close_day
    }
    sales_period_start = new Date(year, month, close_day_start)

    // 終了期間の取得
    if (month === 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }
    if (close_day === 31) {
      var date = adjustmentCloseDay(year, month+1)
      close_day_finish = date
    } else {
      close_day_finish = close_day
    }
    sales_period_finish = new Date(year, month, close_day_finish)

  } else {
    // 給与日が月を跨がない
    // 開始期間の取得
    if (month === 1) {
      year -= 1
      month = 12
    } else {
      month -= 1
    }
    if (close_day === 31){
      close_day_start = adjustmentCloseDay(year, month)
    } else {
      close_day_start = close_day
    }
    sales_period_start = new Date(year, month, close_day_start)

    // 終了期間の取得
    if (month == 12) {
      year += 1
      month = 1
    } else {
      month += 1
    }
    if (close_day === 31) {
      close_day_finish = adjustmentCloseDay(year, month + 1)
    } else {
      close_day_finish = close_day
    }
    sales_period_finish = new Date(year, month, close_day_finish)
  }

  return {"start": sales_period_start, "finish": sales_period_finish}
*/
  // 締め日の調整
  
  if (close_day === 31) {
    close_day = adjustmentCloseDay(year, month);
    if (month === 12) {
      close_day_next_month = adjustmentCloseDay(year+1, 1);
    } else {
      close_day_next_month = adjustmentCloseDay(year, month+1);
    }
  }

  if (close_day < today) {
    start_year = year
    start_month = month
    start_day = close_day
    if (month === 12) {
      finish_year = year + 1
      finish_month = 1
      finish_day = close_day_next_month
    } else {
      finish_year = year
      finish_month = month
      finish_day = close_day_next_month
    }
  } else {
    finish_year = year
    finish_month = month
    finish_day = close_day_next_month
    if (month === 1){
      start_year = year -1
      start_month = 12
      start_day = close_day
    } else {
      start_year = year
      start_month = month - 1
      start_day = close_day
    }
  }
  
  return {"start_year": start_year, "start_month": start_month, "start_day": start_day, "finish_year": finish_year, "finish_month": finish_month, "finish_day": finish_day}
}