
/**
 * mapped type excluding specific keys
 */
export type ExcludeKeys<T, E> = {
  [K in keyof T]: K extends E ? never : T[K];
};
