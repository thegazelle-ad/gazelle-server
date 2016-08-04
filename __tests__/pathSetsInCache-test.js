jest.unmock('lib/falcor/falcorUtils');

import { pathSetsInCache } from 'lib/falcor/falcorUtils';

describe('pathSetsInCache', () => {
	it('does find all pathSets', () => {
		const cache = {
			a: {a: {a: 1, b: 2}, b: {a: 3}},
			b: {b: {c: 3, d: 4}},
			c: {e: {a: 3, f: 4}, c: {k: 5, a: 2}, 'b': {'a': 5}}
		}
		let pathSets = [['a', ['a', 'b'], 'a'], ['b', 'b', 'c'], ['c', 'c', 'k']];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);
		// Check if it can handle a single pathSet
		pathSets = ['a', 'b', 'a'];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);
	});

	it('does find missing pathSets', () => {
		const cache = {
			a: {a: {a: 1, b: 2}, b: {a: 3}},
			b: {b: {c: 3, d: 4}},
			c: {e: {a: 3, f: 4}, c: {k: 5, a: 2}, 'b': {'a': 5}}
		}
		const pathSets = [['a', ['a', 'b'], ['a', 'b']], ['b', 'b', 'c'], [['c', 'c', 'k']]];
		expect(pathSetsInCache(cache, pathSets)).toBe(false);
	});

	it('handles ranges', () => {
		const cache = {
			a: [3, 3, 3, 3, 3]
		};
		let pathSets = ['a', {to: 4}];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);

		pathSets = ['a', {to: 5}];
		expect(pathSetsInCache(cache, pathSets)).toBe(false);

		pathSets = ['a', {from: 3, to: 4}];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);

		pathSets = ['a', {length: 5}];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);

		pathSets = ['a', {from: 3, length: 2}];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);

		pathSets = ['a', {from: 3, length: 3}];
		expect(pathSetsInCache(cache, pathSets)).toBe(false);

		pathSets = ['a', {from: 2, to: 5}];
		expect(pathSetsInCache(cache, pathSets)).toBe(false);

		pathSets = ['a', {from: 2, to: 4}];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);
	});

	it('handles complex expressions', () => {
		const cache = {
			a: [1, 2, 3, 4, 5, 6]
		};
		cache.a.forEach((val, index) => {
			cache.a[index] = {b: {c: {a: val}, d: {a: val*2}}};
		});
		let pathSets = ['a', {length: 6}, 'b', ['c', 'd'], 'a'];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);

		pathSets = ['a', {length: 6}, 'b', ['c', 'd'], 'b'];
		expect(pathSetsInCache(cache, pathSets)).toBe(false);

		pathSets = ['a', {from: 1, length: 6}, 'b', ['c', 'd'], 'a'];
		expect(pathSetsInCache(cache, pathSets)).toBe(false);

		cache.a['key'] = cache.a['key2'] = cache.a['key3'] = {b: {c: {a: 3}, d: {a: 6}}}
		// I'm actually not certain this is valid falcor syntax, but it is supported by the function anyway
		pathSets = ['a', [{length: 6}, 'key', 'key2', 'key3'], 'b', ['c', 'd'], 'a'];
		expect(pathSetsInCache(cache, pathSets)).toBe(true);
	});
})