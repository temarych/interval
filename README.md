# Interval
Lightweight library for working with time and date intervals
## Guide
### Intervals
You can create an instance with such line of code:
```typescript
const interval = new Interval({ from: number, to: number });
```
It doesn't matter in what order you specify `from` and `to` properties, the class will take care of that. There are several methods for checking intersection with other intervals:
```typescript
firstInterval.includes(secondInterval)
firstInterval.touches(secondInterval)
firstInterval.intersects(secondInterval)
firstInterval.equals(secondInterval)
```
Intervals can be either *finite* or *infinite*. You can check this using such accessor:
```typescript
interval.isFinite
```
Apart from this, you can get their length:
```typescript
interval.length
```
as well as convert them to string:
```typescript
interval.toString() // e.g. (-Infinity;526)
```
There are also several static methods for working with multiple intervals:
```typescript
Interval.merge(intervals: Interval[])
// This method merges overlapping intervals. It behaves simillarly to unions in mathematics. 
// Most methods use it by default to ensure their proper behaviour

Interval.inverse(intervals: Interval[])
// This method lets you inverse interval unions, again, like in mathematics. 
// NOT TO CONFUSE with `Interval.getGaps`, which is very simillar, but doesn't include infinite intervals

Interval.limit(intervals: Interval[], range: Interval)
// This method crops interval union, so that it fits into provided range 

Interval.getGaps(intervals: Interval[])
// This method returns gaps between provided intervals

Interval.getSpan(intervals: Interval[])
// This method returns an interval, which includes all provided intervals
```
That's all. You can compose these methods to create your own, custom ones
## Date and time intervals
Similarly to basic intervals, you can create instances with such lines of code:
```typescript
const dateInterval = new DateInterval({ dateStart: Date, dateEnd: Date });
const timeInterval = new TimeInterval({ timeStart: string, timeEnd: string });
```
They are very similar to common intervals, but there are some key differences:
1. Date and time intervals can't be infinite
2. Instead of length, they have *duration*, which is given in milliseconds

Also, `DateInterval` doesn't have `inverse` method, while `TimeInterval` implements it a little bit differently. If you inverse intervals, they will be fitted into a time interval from `00:00` to `24:00`

Time intervals can be converted to date intervals with method `toDateInterval(day: string)`

As well as common intervals, they can be converted to string with `toString` method. Sometimes you don't need to call it manually, for example, when using `join` method on array of intervals
### Time helpers
There are several functions for time and date manipulation used under the hood:
```typescript
getDay(date: Date) // returns day in such format: yyyy-mm-dd
getTime(date: Date) // returns time in such format: hh:mm:ss
getDate(day: string, time?: string) // returns date from specified parameters
getTimeFromMilliseconds(milliseconds: number) // returns time given in format hh:mm:ss from specified milliseconds
getMillisecondsFromTime(time: string) // returns milliseconds from time given in format hh:mm:ss
```
