import { expect, test } from 'tstyche';
import {
  getIn,
  hasIn,
  List,
  Map,
  Record,
  removeIn,
  Seq,
  setIn,
  updateIn,
} from 'immutable';

// Array-like object as produced by the legacy template compiler, or by
// runtime helpers like `Array.from` inputs. It is not iterable, but the
// runtime accepts it as a key path.
const arrayLike: { 0: 'a'; 1: 'b'; length: 2 } = {
  0: 'a',
  1: 'b',
  length: 2,
};

test('Map deep methods accept array-like key paths', () => {
  const map = Map<string, number>();

  expect(map.setIn(arrayLike, 1)).type.toBe<Map<string, number>>();
  expect(map.updateIn(arrayLike, value => value)).type.toBe<
    Map<string, number>
  >();
  expect(map.deleteIn(arrayLike)).type.toBe<Map<string, number>>();
  expect(map.removeIn(arrayLike)).type.toBe<Map<string, number>>();
  expect(map.hasIn(arrayLike)).type.toBeBoolean();
  expect(map.getIn(arrayLike)).type.toBeUnknown();
  expect(map.mergeIn(arrayLike, { x: 1 })).type.toBe<Map<string, number>>();
  expect(map.mergeDeepIn(arrayLike, { x: 1 })).type.toBe<Map<string, number>>();
});

test('List deep methods accept array-like key paths', () => {
  const list = List<number>();

  expect(list.setIn(arrayLike, 1)).type.toBe<List<number>>();
  expect(list.updateIn(arrayLike, value => value)).type.toBe<List<number>>();
  expect(list.deleteIn(arrayLike)).type.toBe<List<number>>();
  expect(list.removeIn(arrayLike)).type.toBe<List<number>>();
  expect(list.mergeIn(arrayLike, [1])).type.toBe<List<number>>();
  expect(list.mergeDeepIn(arrayLike, [1])).type.toBe<List<number>>();
});

test('Record deep methods accept array-like key paths', () => {
  const record = Record({ a: 1 })();

  expect(record.setIn(arrayLike, 1)).type.toBe<typeof record>();
  expect(record.updateIn(arrayLike, value => value)).type.toBe<typeof record>();
  expect(record.deleteIn(arrayLike)).type.toBe<typeof record>();
  expect(record.removeIn(arrayLike)).type.toBe<typeof record>();
  expect(record.hasIn(arrayLike)).type.toBeBoolean();
  expect(record.getIn(arrayLike)).type.toBeUnknown();
  expect(record.mergeIn(arrayLike, { a: 1 })).type.toBe<typeof record>();
  expect(record.mergeDeepIn(arrayLike, { a: 1 })).type.toBe<typeof record>();
});

test('Seq deep methods accept array-like key paths', () => {
  const seq = Seq<string, number>();

  expect(seq.getIn(arrayLike)).type.toBeUnknown();
  expect(seq.hasIn(arrayLike)).type.toBeBoolean();
});

test('standalone functions accept array-like key paths', () => {
  expect(getIn({ a: 1 }, arrayLike)).type.toBeUnknown();
  expect(hasIn({ a: 1 }, arrayLike)).type.toBeBoolean();
  expect(setIn({ a: 1 }, arrayLike, 2)).type.toBe<{ a: number }>();
  expect(removeIn({ a: 1 }, arrayLike)).type.toBe<{ a: number }>();
  expect(updateIn({ a: 1 }, arrayLike, value => value)).type.toBe<{
    a: number;
  }>();
  expect(updateIn({ a: 1 }, arrayLike, 0, value => value)).type.toBe<{
    a: number;
  }>();
});

test('functions `arguments` are accepted as key paths', () =>
  (function (_key1: string, _key2: string) {
    // the type of a function's `arguments` object
    const args: IArguments = arguments;

    const map = Map<string, number>();
    expect(map.setIn(args, 1)).type.not.toRaiseError();
    expect(map.updateIn(args, value => value)).type.not.toRaiseError();
    expect(map.deleteIn(args)).type.not.toRaiseError();
    expect(map.removeIn(args)).type.not.toRaiseError();
    expect(map.hasIn(args)).type.not.toRaiseError();
    expect(map.getIn(args)).type.not.toRaiseError();
    expect(map.mergeIn(args, { x: 1 })).type.not.toRaiseError();
    expect(map.mergeDeepIn(args, { x: 1 })).type.not.toRaiseError();

    const list = List<number>();
    expect(list.setIn(args, 1)).type.not.toRaiseError();

    expect(getIn({ a: 1 }, args)).type.not.toRaiseError();
    expect(hasIn({ a: 1 }, args)).type.not.toRaiseError();
    expect(setIn({ a: 1 }, args, 2)).type.not.toRaiseError();
    expect(removeIn({ a: 1 }, args)).type.not.toRaiseError();
    expect(updateIn({ a: 1 }, args, value => value)).type.not.toRaiseError();
  })('a', 'b'));

test('arrays and ordered collections remain accepted key paths', () => {
  const map = Map<string, number>();

  map.setIn(['a', 'b'], 1);
  map.setIn(List(['a', 'b']), 1);
  map.updateIn(['a', 'b'], value => value);
  map.deleteIn(['a', 'b']);
  map.removeIn(['a', 'b']);
  map.hasIn(['a', 'b']);
  map.getIn(['a', 'b']);
  map.mergeIn(List(['a', 'b']), { x: 1 });

  getIn({ a: 1 }, ['a']);
  getIn({ a: 1 }, List(['a']));
});

test('Map#getIn tuple path inference is unchanged', () => {
  expect(Map({ a: 4, b: true }).getIn(['a' as const])).type.toBeNumber();

  expect(
    Map({ a: Map({ b: Map({ c: Map({ d: 4 }) }) }) }).getIn([
      'a' as const,
      'b' as const,
      'c' as const,
      'd' as const,
    ])
  ).type.toBeNumber();

  // an array-like has no tuple to infer from, so the result is `unknown`
  expect(Map({ a: 4 }).getIn(arrayLike)).type.toBeUnknown();
});

test('invalid key paths still raise errors', () => {
  const map = Map<string, number>();

  expect(map.setIn(undefined, 1)).type.toRaiseError();
  expect(map.setIn({ a: 1, b: 2 }, 1)).type.toRaiseError();
  expect(map.getIn(undefined)).type.toRaiseError();
  expect(getIn({ a: 1 }, undefined)).type.toRaiseError();
  expect(setIn({ a: 1 }, { a: 1, b: 2 }, 2)).type.toRaiseError();
});
