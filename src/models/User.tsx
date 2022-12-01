export class User {
  constructor(
    public id = 0,
    public uuid = '',
    public nickname = '',
    public prefecture = '',
    public company = '',
    public style_flg = '',
    public close_day = 0,
    public daily_target = 0,
    public monthly_target = 0,
    public is_tax = false,
    public open_flg = ''
  ){
  }
}