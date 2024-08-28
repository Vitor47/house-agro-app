import { Component, computed, inject, NO_ERRORS_SCHEMA, signal } from "@angular/core";

import {
  ListViewComponent,
  NativeScriptRouterModule,
} from "@nativescript/angular";
import { ItemDetailComponent } from "./item-detail.component";
import { ItemService } from "./item.service";

@Component({
  selector: "ns-items",
  templateUrl: "./items.component.html",
  standalone: true,
  imports: [ItemDetailComponent, ListViewComponent, NativeScriptRouterModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ItemsComponent {
  private itemService = inject(ItemService);
  search = signal('');
  items = computed(() => {
    const search = this.search();
    if(!search) {
      return this.itemService.getItems();
    }
    return this.itemService.serchItems(search);
  });
}
