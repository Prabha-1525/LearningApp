/** Branded opaque id helpers keep domain ids from mixing. */
export type Brand<T, B extends string> = T & {readonly __brand: B};

export type IsoDateTimeString = Brand<string, 'IsoDateTimeString'>;
