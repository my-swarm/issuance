export function strcmp(str1: string, str2: string): number {
  return str1 == str2 ? 0 : str1 > str2 ? 1 : -1;
}

export function sameAddress(a1?: string, a2?: string): boolean {
  return (a1 || '').toLowerCase() === (a2 || '').toLowerCase();
}
