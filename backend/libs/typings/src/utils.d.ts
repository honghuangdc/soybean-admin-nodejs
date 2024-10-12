export type PropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}.${infer R}`
      ? K extends keyof T
        ? PropType<T[K], R>
        : unknown
      : unknown;

/**
 * NestedKeyOf
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedKeyOf<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type RecordNamePaths<T extends object> = {
  [K in NestedKeyOf<T>]: PropType<T, K>;
};
