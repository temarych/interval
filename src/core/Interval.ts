export interface IInterval {
  from: number;
  to: number;
}

export class Interval implements IInterval {
  public readonly from: number;
  public readonly to: number;

  constructor(interval: IInterval) {
    this.from = interval.from > interval.to ? interval.to : interval.from;
    this.to = interval.from > interval.to ? interval.from : interval.to;
  }

  public get length() {
    return this.to - this.from;
  }

  public includes(interval: Interval) {
    return this.from <= interval.from && interval.to <= this.to;
  }

  public intersects(interval: Interval) {
    return Math.max(this.from, interval.from) < Math.min(this.to, interval.to);
  }

  public touches(interval: Interval) {
    return interval.from === this.to || interval.to === this.from;
  }

  public equals(interval: Interval) {
    return interval.from === this.from && interval.to === this.to;
  }

  public get isFinite() {
    return isFinite(this.from) && isFinite(this.to);
  }

  public toString() {
    return `(${this.from};${this.to})`;
  }

  public static limit(intervals: Interval[], range: Interval) {
    const mergedIntervals = Interval.merge(intervals);
    const filteredIntervals = mergedIntervals.filter(interval => range.intersects(interval));
    const limitedIntervals = filteredIntervals.map(interval => {
      if (range.includes(interval)) return interval;
      return new Interval({
        from: Math.max(interval.from, range.from), 
        to: Math.min(interval.to, range.to)
      });
    });
    return limitedIntervals.filter(interval => interval.length);
  }

  public static inverse(intervals: Interval[]) {
    const result: Interval[] = [];
    const mergedIntervals = Interval.merge(intervals);

    if (!mergedIntervals.length) {
      return [
        new Interval({
          from: -Infinity,
          to: Infinity
        })
      ];
    }

    const firstInterval = mergedIntervals[0];
    const lastInterval = mergedIntervals[mergedIntervals.length - 1];

    if (isFinite(firstInterval.from)) {
      result.push(
        new Interval({
          from: -Infinity,
          to: firstInterval.from
        })
      );
    }

    mergedIntervals.forEach((interval, index) => {
      const nextInterval = mergedIntervals[index + 1];
      if (!nextInterval) return;
      result.push(
        new Interval({
          from: interval.to,
          to: nextInterval.from
        })
      );
    });

    if (isFinite(lastInterval.to)) {
      result.push(
        new Interval({
          from: lastInterval.to,
          to: Infinity
        })
      );
    }

    return result;
  }

  public static merge(intervals: Interval[]) {
    const stack: Interval[] = [];

    if (!intervals.length) return [];

    const sortedIntervals = intervals.sort((firstInterval, secondInterval) => {
      return firstInterval.from - secondInterval.from;
    });

    stack.push(sortedIntervals[0]);

    for (let index = 1; index < sortedIntervals.length; index++) {
      const interval = sortedIntervals[index];
      const lastStackInterval = stack[stack.length - 1];

      const isMergable =
        interval.intersects(lastStackInterval) ||
        interval.touches(lastStackInterval);

      if (!isMergable) {
        stack.push(interval);
        continue;
      }

      const mergedInterval = Interval.getSpan([interval, lastStackInterval]);

      stack.pop();
      stack.push(mergedInterval);
    }

    return stack;
  }

  public static getGaps(intervals: Interval[]) {
    return Interval.inverse(intervals).filter(interval => interval.isFinite);
  }

  public static getSpan(intervals: Interval[]) {
    return new Interval({
      from: Math.min(...intervals.map((interval) => interval.from)),
      to: Math.max(...intervals.map((interval) => interval.to))
    });
  }
}