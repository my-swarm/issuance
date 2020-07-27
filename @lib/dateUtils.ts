import moment from 'moment';

export function createDate(d: string): Date {
  return moment(d).toDate();
}

export function formatDate(d: Date): string {
  return moment(d).format('LL');
}
