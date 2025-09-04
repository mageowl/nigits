import { Accessor } from "ags";

export function getThreshold(value: number, levels: number[]) {
  return levels.findLastIndex((l) => value >= l) ?? 0;
}

export function transform<T, R>(value: T | Accessor<T>, callback: (value: T) => R): Accessor<R> | R {
  if (value instanceof Accessor) {
    return value(callback);
  } else {
    return callback(value);
  }
}
