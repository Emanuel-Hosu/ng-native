import { Component, signal } from '@angular/core';
import { NativeHeaderItem, type HeaderItemType } from '../../router/src/native-header-item.ts';

@Component({
  selector: 'x-header-item-host',
  imports: [NativeHeaderItem],
  template: `<native-header-item [type]="type()"><text>Ada</text></native-header-item>`,
})
export class HeaderItemHost {
  readonly type = signal<HeaderItemType | undefined>('title');
}
