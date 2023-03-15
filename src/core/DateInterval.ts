import { IInterval, Interval } from "./Interval";

export interface IDateInterval {
  dateStart: Date;
  dateEnd: Date;
}

export class DateInterval implements IDateInterval {
  public readonly dateStart: Date;
  public readonly dateEnd: Date;

  constructor(dateInterval: IDateInterval) {
    this.dateStart = dateInterval.dateStart;
    this.dateEnd = dateInterval.dateEnd;
  }

  public get duration() {
    return this.toInterval().length;
  }

  public includes(dateInterval: DateInterval) {
    return this.toInterval().includes(dateInterval.toInterval());
  }

  public intersects(dateInterval: DateInterval) {
    return this.toInterval().intersects(dateInterval.toInterval());
  }

  public touches(dateInterval: DateInterval) {
    return this.toInterval().touches(dateInterval.toInterval());
  }

  public equals(dateInterval: DateInterval) {
    return this.toInterval().equals(dateInterval.toInterval());
  }

  public static merge(dateIntervals: DateInterval[]) {
    const intervals = dateIntervals.map(dateInterval => dateInterval.toInterval());
    return Interval.merge(intervals).map(interval => DateInterval.fromInterval(interval));
  }

  public static limit(dateIntervals: DateInterval[], range: DateInterval) {
    const intervals = dateIntervals.map(dateInterval => dateInterval.toInterval());
    return Interval.limit(intervals, range.toInterval()).map(interval => DateInterval.fromInterval(interval));
  }

  public static getSpan(dateIntervals: DateInterval[]) {
    const intervals = dateIntervals.map(dateInterval => dateInterval.toInterval());
    return DateInterval.fromInterval(Interval.getSpan(intervals));
  }

  public static getGaps(dateIntervals: DateInterval[]) {
    const intervals = dateIntervals.map(dateInterval => dateInterval.toInterval());
    const subintervals = Interval.inverse(intervals).filter(interval => interval.isFinite);
    return subintervals.map(subinterval => DateInterval.fromInterval(subinterval));
  }

  public toInterval() {
    return new Interval({
      from: Number(this.dateStart),
      to: Number(this.dateEnd)
    });
  }

  public static fromInterval(interval: IInterval) {
    return new DateInterval({
      dateStart: new Date(interval.from),
      dateEnd: new Date(interval.to)
    });
  }
}