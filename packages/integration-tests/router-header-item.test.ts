/**
 * `<native-header-item>`: anything Angular renders, in a slot of the navigation bar, committed as
 * react-native-screens' `RNSScreenStackHeaderSubview`.
 */
import assert from 'node:assert/strict';
import { afterEach, before, describe, it } from 'node:test';
import type { Type, WritableSignal } from '@angular/core';
import { cleanup, render } from '@ng-native/testing';
import type { HeaderItemType } from '../router/src/native-header-item.ts';
import { registerScreenComponents } from '../router/src/screens.ts';
import { compileFixture } from './compile.ts';

describe('native header item', () => {
  let Host: Type<unknown>;

  before(async () => {
    registerScreenComponents();
    const mod = await compileFixture('fixtures/header-item.ts');
    Host = mod['HeaderItemHost'] as Type<unknown>;
  });

  afterEach(() => cleanup());

  // Android's header knows left, center, right, back and searchBar, and throws on anything else.
  it('commits a title item as center, the spelling both platforms take', async () => {
    const { fabric } = await render(Host);
    const item = fabric.find('RNSScreenStackHeaderSubview');
    assert.ok(item);
    assert.equal(item.props['type'], 'center');
  });

  it('commits every other slot as it is written', async () => {
    const { fabric, instance, detectChanges } = await render(Host);
    const type = (instance as { type: WritableSignal<HeaderItemType | undefined> }).type;
    for (const slot of ['left', 'center', 'right', 'back', 'searchBar'] as const) {
      type.set(slot);
      await detectChanges();
      assert.equal(fabric.find('RNSScreenStackHeaderSubview')!.props['type'], slot);
    }
  });
});
