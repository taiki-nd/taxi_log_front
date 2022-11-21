import moment from "moment";

export class Detail {
  constructor(
    public id = 0,
    public depart_hour = 0,
    public depart_place = '',
    public arrive_place = '',
    public is_tax = false,
    public sales = 0,
    public method_flg = '',
    public description = '',
    public record_id = 0,
  ){
  }
}