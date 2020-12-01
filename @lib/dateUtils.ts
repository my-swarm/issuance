import moment, { Moment } from 'moment';

export type Datelike = string | number | Moment | Date;

export function toMoment(d: Datelike) {
  if (typeof d === 'number') {
    return moment.unix(d);
  } else {
    return moment(d);
  }
}

export function createDate(d: string | number): Date {
  const m = typeof d === 'number' ? moment.unix(d) : moment(d);
  return m.toDate();
}

export function formatDate(d: Datelike): string {
  return toMoment(d).format('LL');
}

export function formatDatetime(d: Datelike): string {
  return toMoment(d).format('lll');
}

export function getUnixTimestamp(d: Datelike): number {
  if (typeof d === 'number') return d;
  return moment(d).unix();
}
