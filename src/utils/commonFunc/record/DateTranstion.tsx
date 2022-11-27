/**
 * dateTransition
 * @param date 
 * @returns string
 */
export const DateTransition = (date: string) => {
  var transitionDate = new Date(date);
  return transitionDate.getFullYear() + '/' +('0' + (transitionDate.getMonth()+1)).slice(-2)+ '/' +  ('0' + transitionDate.getDate()).slice(-2);
}

/**
 * dayTransition
 * @param day 
 * @returns string
 */
export const DayTransition = (day: string) => {
  switch (day) {
    case 'Mon.':
      return '月'
    case 'Tue.':
      return '火'
    case 'Wed.':
      return '水'
    case 'Thu.':
      return '木'
    case 'Fri.':
      return '金'
    case 'Sat.':
      return '土'
    case 'Sun.':
      return '日'
  }
}