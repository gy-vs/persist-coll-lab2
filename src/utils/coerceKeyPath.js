import { isOrdered } from '../predicates/isOrdered';
import isArrayLike from './isArrayLike';
import arrCopy from './arrCopy';

export default function coerceKeyPath(keyPath) {
  if (Array.isArray(keyPath)) {
    return keyPath;
  }
  if (isArrayLike(keyPath) && typeof keyPath !== 'string') {
    // Array-like values (e.g. `arguments` or `{0: 'a', length: 1}`) are
    // accepted as key paths, but they need to be copied into a real Array so
    // Array-only methods like `slice` can be used on them further down the
    // line, including when formatting error messages.
    return arrCopy(keyPath);
  }
  if (isOrdered(keyPath)) {
    return keyPath.toArray();
  }
  throw new TypeError(
    'Invalid keyPath: expected Ordered Collection or Array: ' + keyPath
  );
}
