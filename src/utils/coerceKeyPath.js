import arrCopy from './arrCopy';
import { isOrdered } from '../predicates/isOrdered';
import isArrayLike from './isArrayLike';

export default function coerceKeyPath(keyPath) {
  if (Array.isArray(keyPath)) {
    return keyPath;
  }
  if (isArrayLike(keyPath) && typeof keyPath !== 'string') {
    // Array-like objects (e.g. `arguments` or `{ 0: 'a', length: 1 }`) are
    // treated like arrays, but they lack array methods (`slice`, etc.) which
    // the keyPath handling relies on, so they get copied into a real Array.
    return arrCopy(keyPath);
  }
  if (isOrdered(keyPath)) {
    return keyPath.toArray();
  }
  throw new TypeError(
    'Invalid keyPath: expected Ordered Collection or Array: ' + keyPath
  );
}
