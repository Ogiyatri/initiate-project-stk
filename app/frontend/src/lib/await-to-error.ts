export function awaitToError<E extends Error = Error, T = unknown>(
  promise: Promise<T>,
): Promise<[E, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[E, undefined]>((err: E) => [err, undefined]);
}
