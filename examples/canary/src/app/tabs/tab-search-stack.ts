import { Component, computed, signal } from '@angular/core';
import { ScrollView, Text } from '@ng-native/components';
import {
  NativeHeader,
  NativeHeaderItem,
  NativeSearchBar,
  NativeStackOutlet,
} from '@ng-native/router';
import { page } from '../screen-styles.ts';

/** TRY: the search tab as a stack, so its header can hold the search bar the role activates. */
@Component({
  selector: 'x-tab-search-stack',
  imports: [NativeStackOutlet],
  template: `<native-stack-outlet />`,
})
export class TabSearchStack {}

@Component({
  selector: 'x-search-list',
  imports: [NativeHeader, NativeHeaderItem, NativeSearchBar, ScrollView, Text],
  template: `
    <native-header title="Search" [largeTitle]="true">
      <native-header-item type="searchBar">
        <native-search-bar placeholder="Albums" [hideWhenScrolling]="false" [(query)]="query" />
      </native-header-item>
    </native-header>
    <scroll-view
      class="screen"
      contentInsetAdjustmentBehavior="automatic"
      [contentContainerStyle]="page.content"
    >
      <text class="hint">Query: "{{ query() }}"</text>
      @for (album of found(); track album) {
        <text class="body">{{ album }}</text>
      }
    </scroll-view>
  `,
})
export class SearchList {
  protected readonly page = page;
  protected readonly query = signal('');
  private readonly albums = ['Kind of Blue', 'Blue Train', 'Giant Steps', 'A Love Supreme'];
  protected readonly found = computed(() =>
    this.albums.filter((a) => a.toLowerCase().includes(this.query().toLowerCase())),
  );
}
