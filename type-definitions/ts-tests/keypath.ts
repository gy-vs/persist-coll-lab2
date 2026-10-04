import { expect, test } from 'tstyche';
import type { KeyPath } from 'immutable';
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

const arrayLike: { 0: 'a'; 1: 'b'; length: 2 } = {
  0: 'a',
  1: 'b',
  length: 2,
};
const genericArrayLike: ArrayLike<string> = arrayLike;

test('KeyPath type alias', () => {
  expect<KeyPath>().type.toBeAssignableWith(arrayLike);
  expect<KeyPath>().type.toBeAssignableWith(genericArrayLike);
  expect<KeyPath>().type.toBeAssignableWith(['a', 'b']);
  expect<KeyPath>().type.toBeAssignableWith(List(['a']));
  expect<KeyPath>().type.toBeAssignableWith(Seq(['a']));
});

test('List *In methods accept an array-like keyPath', () => {
  expect(List<number>().getIn(arrayLike)).type.toBeUnknown();
  expect(List<number>().hasIn(arrayLike)).type.toBeBoolean();
  expect(List<number>().setIn(arrayLike, 0)).type.toBe<List<number>>();
  expect(List<number>().updateIn(arrayLike, v => v)).type.toBe<List<number>>();
  expect(List<number>().deleteIn(arrayLike)).type.toBe<List<number>>();
  expect(List<number>().removeIn(arrayLike)).type.toBe<List<number>>();
  expect(List<number>().mergeIn(arrayLike, [])).type.toBe<List<number>>();
  expect(List<number>().mergeDeepIn(arrayLike, [])).type.toBe<List<number>>();
});

test('Map *In methods accept an array-like keyPath', () => {
  expect(Map<string, number>().getIn(arrayLike)).type.toBeUnknown();
  expect(Map<string, number>().hasIn(arrayLike)).type.toBeBoolean();
  expect(Map<string, number>().setIn(arrayLike, 0)).type.toBe<
    Map<string, number>
  >();
  expect(Map<string, number>().updateIn(arrayLike, v => v)).type.toBe<
    Map<string, number>
  >();
  expect(Map<string, number>().deleteIn(arrayLike)).type.toBe<
    Map<string, number>
  >();
  expect(Map<string, number>().removeIn(arrayLike)).type.toBe<
    Map<string, number>
  >();
  expect(Map<string, number>().mergeIn(arrayLike, {})).type.toBe<
    Map<string, number>
  >();
  expect(Map<string, number>().mergeDeepIn(arrayLike, {})).type.toBe<
    Map<string, number>
  >();
});

test('MapOf #getIn keeps inferring tuples and accepts array-like', () => {
  expect(
    Map({ a: Map({ b: Map({ c: 4 }) }) }).getIn([
      'a' as const,
      'b' as const,
      'c' as const,
    ])
  ).type.toBeNumber();

  expect(Map({ a: 4, b: true }).getIn(arrayLike)).type.toBeUnknown();
});

test('Record *In methods accept an array-like keyPath', () => {
  const MyRecord = Record({ a: '', b: 0 });
  const r = MyRecord();

  expect(r.getIn(arrayLike)).type.toBeUnknown();
  expect(r.hasIn(arrayLike)).type.toBeBoolean();
  expect(r.setIn(arrayLike, 0)).type.toBe<typeof r>();
  expect(r.updateIn(arrayLike, v => v)).type.toBe<typeof r>();
  expect(r.deleteIn(arrayLike)).type.toBe<typeof r>();
  expect(r.removeIn(arrayLike)).type.toBe<typeof r>();
  expect(r.mergeIn(arrayLike, {})).type.toBe<typeof r>();
  expect(r.mergeDeepIn(arrayLike, {})).type.toBe<typeof r>();
});

test('Seq *In methods accept an array-like keyPath', () => {
  const seq = Seq({ a: 1 });
  expect(seq.getIn(arrayLike)).type.toBeUnknown();
  expect(seq.hasIn(arrayLike)).type.toBeBoolean();
});

test('functional *In accept an array-like keyPath', () => {
  expect(getIn({ a: 1 }, arrayLike)).type.toBeUnknown();
  expect(hasIn({ a: 1 }, arrayLike)).type.toBeBoolean();
  expect(setIn({ a: 1 }, arrayLike, 2)).type.toBe<{ a: number }>();
  expect(updateIn({ a: 1 }, arrayLike, v => v)).type.toBe<{
    a: number;
  }>();
  expect(removeIn({ a: 1 }, arrayLike)).type.toBe<{ a: number }>();
});

test('functional *In accept an arguments keyPath', () => {
  const fn = function () {
    expect(getIn({ a: 1 }, arguments)).type.toBeUnknown();
    expect(hasIn({ a: 1 }, arguments)).type.toBeBoolean();
    expect(setIn({ a: 1 }, arguments, 2)).type.toBe<{ a: number }>();
    expect(updateIn({ a: 1 }, arguments, v => v)).type.toBe<{
      a: number;
    }>();
    expect(removeIn({ a: 1 }, arguments)).type.toBe<{ a: number }>();
  };
  fn();
});

test('arrays and Ordered collections are still accepted', () => {
  expect(getIn({ a: 1 }, ['a'])).type.toBeUnknown();
  expect(getIn({ a: 1 }, List(['a']))).type.toBeUnknown();
  expect(getIn({ a: 1 }, Seq(['a']))).type.toBeUnknown();
});

test('invalid keyPaths are rejected', () => {
  expect(getIn({ a: 1 }, 42)).type.toRaiseError();
  expect(getIn({ a: 1 }, { a: 1, b: 2 })).type.toRaiseError();
  expect(setIn({ a: 1 }, undefined, 2)).type.toRaiseError();
  expect(Map().getIn(null)).type.toRaiseError();
});
