import moment from 'moment';

export function createDate(d: string): Date {
  return moment(d).toDate();
}

export function formatDate(d: Date): string {
  return moment(d).format('LL');
}

export function getUnixTimestamp(d: Date | moment.Moment | string): number {
  if (d instanceof Date || typeof d === 'string') {
    d = moment(d);
  }
  return d.unix();
}
