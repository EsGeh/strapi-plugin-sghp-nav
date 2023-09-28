import {
  Localization,
  Locale,
} from "../basic";

import * as basic from "../basic";


export type {
  Locale,
  Localization,
} from "../basic";


export type Navigation<Item = NavItem, NavData = NavigationData> =
  basic.Navigation<Item, NavData>;

export type NavItem<Data = NavItemData> =
  basic.NavItem<Data>;

export type NavigationData =
  basic.NavigationData & {
    relatedEntities: Related[],
  }

export type NavItemData =
  basic.NavItemData<Related>;

export type Related = {
  id: number,
  displayName: string,
}
