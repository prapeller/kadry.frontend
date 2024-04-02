export function getEnumValues<T>(enumType: T): string[] {
  // @ts-ignore
  return Object.keys(enumType)
    .map(key => (enumType as any)[key])
    .filter(value => typeof value === 'string') as string[];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}