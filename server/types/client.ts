import {
  Localization,
  Locale,
  NavigationData,
} from "./basic";

import * as basic from "./basic";


export type {
  Locale,
  Localization,
  NavigationData,
} from "./basic";

export type Navigation<Item = NavItem> = basic.Navigation<Item>;

export type NavItem = NavItemData & {
  subItems: NavItem[],
};

export type NavItemData = basic.NavItemData<any>
