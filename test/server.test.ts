import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { pluralizeWord, singularizeWord, isPlural } from '../src/server.js';

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
