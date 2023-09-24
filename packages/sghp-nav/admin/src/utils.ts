export * from '../../server/types/utils';

import { FrontNav, FrontNavItem} from "./types";
import * as backendTypes from '../../server/types/admin';


export function itemSetRemoved(
  item: FrontNavItem,
  removed: boolean,
) {
  item.removed = removed;
  item.subItems.forEach( subItem => {
    itemSetRemoved( subItem, removed );
  } );
}

export function navFromBackend(
  nav: backendTypes.Navigation,
):
  FrontNav
{
  return {
    ...nav,
    items: itemsFromBackend( nav.items ),
  }
}

export function itemsFromBackend(
  items: backendTypes.NavItem[],
):
  FrontNavItem[]
{
  return items.map( item => ( {
    ...item,
    subItems: itemsFromBackend( item.subItems ),
    removed: false,
  } ) );
}
