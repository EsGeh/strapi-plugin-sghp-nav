import * as types from '../../server/types/admin';

export type {
  Related,
  Locale,
} from '../../server/types/admin';


export type FrontNav = types.Navigation<FrontNavItem >
export type FrontNavItem =
  types.NavItem<ItemData>;

type ItemData =
  Omit<types.NavItemData,"id"> & {
    id?: types.NavItemData["id"],
    removed: boolean,
  }
