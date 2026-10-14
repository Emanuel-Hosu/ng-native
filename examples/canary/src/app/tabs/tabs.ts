import { Component, computed, inject } from '@angular/core';
import { nativePlatform } from '@ng-native/fabric';
import type { TabIcon } from '@ng-native/router';
import { NativeHeader, NativeTab, NativeTabsOutlet } from '@ng-native/router';
import { Unread } from './unread.ts';

/**
 * A native tab bar: `UITabBarController` on iOS, a bottom navigation bar on Android.
 *
 * The tabs are declared here, the way a page declares its `<native-header>`: each `<native-tab>`
 * is one bar item and the screen behind it, and `path` names the child route it selects. The
 * badge is a signal, which is the thing that made the template the right place for this - a count
 * of unread anything changes, and route configuration does not.
 *
 * The outer header is hidden because this page is itself a screen on the app's stack, and the
 * library tab brings its own stack with its own headers. Two headers over one screen is what you
 * get otherwise.
 */
@Component({
  selector: 'x-tabs',
  imports: [NativeHeader, NativeTab, NativeTabsOutlet],
  template: `
    <native-header [hidden]="true" />
    <native-tabs-outlet>
      <native-tab
        path="library"
        title="Library 3"
        [icon]="libraryIcon"
        [standardAppearance]="appearance"
      />
      <!-- A require()d image rather than a symbol, drawn as a mask so it tints like one.
           A bar item never scales its image, so the asset is icon-sized at 1x, 2x and 3x. -->
      <!-- TRY: the iOS 26 search tab. Flip these two and reload to compare. -->
      <native-tab
        path="search"
        [systemItem]="trySystem"
        [title]="trySystem ? undefined : 'Search'"
        [role]="tryRole"
        [automaticallyActivatesSearch]="tryAuto"
      />
      <native-tab path="profile" title="Profile" [icon]="profileIcon" [badge]="badge()" />
    </native-tabs-outlet>
  `,
})
export class TabsPage {
  private readonly unread = inject(Unread);

  /**
   * SF Symbols are iOS's, so an Android tab needs an image. This is the choice a real app makes
   * per item; the search tab below uses the same image on both to show that one can.
   */
  private readonly symbol = (name: string, image: unknown): TabIcon =>
    nativePlatform() === 'android' ? { template: image } : { sfSymbol: name };

  protected readonly libraryIcon = this.symbol(
    'books.vertical.fill',
    require('../../../assets/tab-library.png'),
  );
  protected readonly profileIcon = this.symbol(
    'person.crop.circle',
    require('../../../assets/tab-profile.png'),
  );

  protected readonly trySystem: 'search' | undefined = 'search';
  protected readonly tryRole: 'search' | undefined = 'search';
  protected readonly tryAuto = false;

  protected readonly searchIcon = require('../../../assets/tab-search.png');
  // Native carries one iconType for both states, so the selected icon has to be a template too.
  protected readonly searchIconSelected = require('../../../assets/tab-search-selected.png');

  /**
   * A bar item's appearance, per state. These colours are nested inside a prop native parses
   * itself, so nothing in the commit walk would process them; the component does it.
   */
  protected readonly appearance = {
    stacked: {
      selected: { tabBarItemTitleFontColor: '#ff9f0a', tabBarItemIconColor: '#ff9f0a' },
    },
  };

  /** Change it from inside the profile tab and watch the bar follow. */
  protected readonly badge = computed(() =>
    this.unread.count() > 0 ? String(this.unread.count()) : undefined,
  );
}
