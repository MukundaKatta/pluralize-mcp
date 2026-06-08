import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import {
  pluralizeWord,
  singularizeWord,
  isPlural,
  requireWord,
  optionalCount,
} from '../src/server.js';

test('pluralizes regular nouns', () => {
  assert.equal(pluralizeWord('cat'), 'cats');
  assert.equal(pluralizeWord('box'), 'boxes');
});

test('pluralizes irregular nouns', () => {
  assert.equal(pluralizeWord('mouse'), 'mice');
  assert.equal(pluralizeWord('child'), 'children');
  assert.equal(pluralizeWord('person'), 'people');
});

test('count=1 returns singular', () => {
  assert.equal(pluralizeWord('cat', 1), 'cat');
});

test('count!=1 returns plural', () => {
  assert.equal(pluralizeWord('cat', 2), 'cats');
  assert.equal(pluralizeWord('cat', 0), 'cats');
});

test('inclusive prefixes the count', () => {
  assert.equal(pluralizeWord('cat', 1, true), '1 cat');
  assert.equal(pluralizeWord('cat', 5, true), '5 cats');
});

test('singularize is inverse', () => {
  assert.equal(singularizeWord('mice'), 'mouse');
  assert.equal(singularizeWord('cats'), 'cat');
  assert.equal(singularizeWord('children'), 'child');
});

test('isPlural identifies plurals', () => {
  assert.equal(isPlural('cats'), true);
  assert.equal(isPlural('mice'), true);
  assert.equal(isPlural('cat'), false);
});

test('requireWord accepts non-empty strings', () => {
  assert.equal(requireWord('cat'), 'cat');
});

test('requireWord rejects non-strings and empty strings', () => {
  assert.throws(() => requireWord(undefined), /must be a string/);
  assert.throws(() => requireWord(123), /must be a string/);
  assert.throws(() => requireWord(''), /must not be empty/);
});

test('optionalCount passes through finite numbers and undefined', () => {
  assert.equal(optionalCount(undefined), undefined);
  assert.equal(optionalCount(null), undefined);
  assert.equal(optionalCount(5), 5);
  assert.equal(optionalCount(0), 0);
});

test('optionalCount rejects non-finite and non-numbers', () => {
  assert.throws(() => optionalCount('2'), /finite number/);
  assert.throws(() => optionalCount(NaN), /finite number/);
  assert.throws(() => optionalCount(Infinity), /finite number/);
});
