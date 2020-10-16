import moment from 'moment';

export function createDate(d: string | number): Date {
  let m = typeof d === 'number' ? moment.unix(d) : moment(d);
  return m.toDate();
}

export function formatDate(d: Date | number): string {
  let m = typeof d === 'number' ? moment.unix(d) : moment(d);
  return m.format('LL');
}

export function getUnixTimestamp(d: Date | moment.Moment | string): number {
  if (d instanceof Date || typeof d === 'string') {
    d = moment(d);
  }
  return d.unix();
}
