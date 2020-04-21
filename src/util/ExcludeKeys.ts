
/**
 * mapped type excluding specific keys
 */
export type ExcludeKeys<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
