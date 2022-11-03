import moment from "moment";

export class Record {
  constructor(
    public id = 0,
    public date = '',
    public day = '',
    public style_flg = '',
    public start_hour = 0,
    public running_time = 0,
    public number_of_time = 0,
    public occupancy_rate = 0,
    public is_tax = false,
    public birth_year = 0,
    public daily_sales = 0,
    public user_id = 0,
  ){
  }
}