export function getEnumValues<T>(enumType: T): string[] {
  // @ts-ignore
  return Object.keys(enumType)
    .map(key => (enumType as any)[key])
    .filter(value => typeof value === 'string') as string[];
}