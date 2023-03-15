import { getDate, getMillisecondsFromTime, getTimeFromMilliseconds } from "../utils/time";
import { DateInterval } from "./DateInterval";
import { IInterval, Interval } from "./Interval";

export interface ITimeInterval {
  timeStart: string;
  timeEnd: string;
}

export class TimeInterval implements ITimeInterval {
  public readonly timeStart: string;
  public readonly timeEnd: string;

  constructor(timeInterval: ITimeInterval) {
    this.timeStart = timeInterval.timeStart;
    this.timeEnd = timeInterval.timeEnd;
  }

  public get duration() {
    return this.toInterval().length;
  }

  public includes(timeInterval: TimeInterval) {
    return this.toInterval().includes(timeInterval.toInterval());
  }

  public intersects(timeInterval: TimeInterval) {
    return this.toInterval().intersects(timeInterval.toInterval());
  }

  public touches(timeInterval: TimeInterval) {
    return this.toInterval().touches(timeInterval.toInterval());
  }

  public equals(timeInterval: TimeInterval) {
    return this.toInterval().equals(timeInterval.toInterval());
  }

  public static merge(timeIntervals: TimeInterval[]) {
    const intervals = timeIntervals.map(timeInterval => timeInterval.toInterval());
    return Interval.merge(intervals).map(interval => TimeInterval.fromInterval(interval));
  }

  public static limit(timeIntervals: TimeInterval[], range: TimeInterval) {
    const intervals = timeIntervals.map(timeInterval => timeInterval.toInterval());
    return Interval.limit(intervals, range.toInterval()).map(interval => TimeInterval.fromInterval(interval));
  }

  public static getSpan(timeIntervals: TimeInterval[]) {
    const intervals = timeIntervals.map(timeInterval => timeInterval.toInterval());
    return TimeInterval.fromInterval(Interval.getSpan(intervals));
  }

  public static getGaps(timeIntervals: TimeInterval[]) {
    const intervals = timeIntervals.map(timeInterval => timeInterval.toInterval());
    const subintervals = Interval.inverse(intervals).filter(interval => interval.isFinite);
    return subintervals.map(subinterval => TimeInterval.fromInterval(subinterval));
  }

  public static inverse(timeIntervals: TimeInterval[]) {
    const intervals = timeIntervals.map(timeInterval => timeInterval.toInterval());
    const subintervals = Interval.inverse(intervals);
    const rangeTimeInterval = new TimeInterval({ timeStart: "00:00", timeEnd: "24:00" });
    const limitedSubintervals = Interval.limit(subintervals, rangeTimeInterval.toInterval());
    return limitedSubintervals.map(subinterval => TimeInterval.fromInterval(subinterval));
  }

  public toString() {
    return `(${this.timeStart};${this.timeEnd})`;
  }

  public toInterval() {
    return new Interval({
      from: getMillisecondsFromTime(this.timeStart),
      to: getMillisecondsFromTime(this.timeEnd)
    });
  }

  public toDateInterval(day: string) {
    return new DateInterval({
      dateStart: getDate(day, this.timeStart),
      dateEnd: getDate(day, this.timeEnd)
    });
  }

  public static fromInterval(interval: IInterval) {
    return new TimeInterval({
      timeStart: getTimeFromMilliseconds(interval.from),
      timeEnd: getTimeFromMilliseconds(interval.to)
    });
  }
}