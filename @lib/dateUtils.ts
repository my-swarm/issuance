import dayjs, { Dayjs } from 'dayjs';

export type Datelike = string | number | Dayjs | Date;

export function toDayjs(d: Datelike): Dayjs {
  if (typeof d === 'number') {
    return dayjs.unix(d);
  } else {
    return dayjs(d);
  }
}

export function createDate(d: string | number): Date {
  const m = typeof d === 'number' ? dayjs.unix(d) : dayjs(d);
  return m.toDate();
}

export function formatDate(d: Datelike): string {
  return toDayjs(d).format('LL');
}

export function formatDatetime(d: Datelike): string {
  return toDayjs(d).format('lll');
}

export function getUnixTimestamp(d: Datelike): number {
  if (typeof d === 'number') return d;
  return dayjs(d).unix();
}
