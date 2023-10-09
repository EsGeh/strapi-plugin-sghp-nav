import {
  Navigation,
  NavItem,
} from "./common";

import {cloneDeep} from "lodash";


export function findItemById(
  nav: Navigation,
  id: number,
):
  NavItem|undefined
{
  return findItemHelper( nav.items, item => (item.id === id ) );
}

export function findItem(
  nav: Navigation,
  cond: (item: NavItem) => boolean,
):
  NavItem|undefined
{
  return findItemHelper( nav.items, cond );
}

function findItemHelper(
  items: NavItem[],
  cond: (item: NavItem) => boolean,
):
  NavItem|undefined
{
  const res = items.find( item => { return cond(item) } );
  if( res )
    return res;
  for( const item of items ) {
    const res = findItemHelper( item.subItems, cond);
    if( res )
      return res;
  }
  return undefined;
}

export function addItemPure(
  nav: Navigation,
  item: NavItem,
  parent?: NavItem,
):
  Navigation
{
  const navCopy = cloneDeep( nav );
  addItem(
    navCopy,
    item,
    parent
  );
  return navCopy;
}

/*
export function editItemPure(
  nav: Navigation,
  item: NavItem,
  parent?: NavItem,
):
  Navigation
{
  const navCopy = cloneDeep( nav );
  editItem(
    navCopy,
    item,
    parent
  );
  return navCopy;
}
*/

export function addItem(
  nav: Navigation,
  item: NavItem,
  parent?: NavItem,
):
  number
{
  if( !parent ) {
    nav.items.push( item );
    return nav.items.length - 1;
  }
  else {
    parent.subItems.push( item );
    return parent.subItems.length - 1;
  }
}

export function itemMoveUp( nav: Navigation, item: NavItem )
{
  itemMoveUpHelper(nav.items, item);
}

function itemMoveUpHelper( items: NavItem[], item: NavItem ):
  boolean
{
  const index = items.findIndex( x => x.id == item.id )
  if( index == 0 ) return false;
  if( index != -1 ) {
    const temp = items[index-1];
    items[index-1] = items[index];
    items[index] = temp;
    return true;
  }
  for( const subSearch of items ) {
    if( itemMoveUpHelper( subSearch.subItems, item ) ) {
      return true;
    }
  }
  return false;
}

export function itemMoveDown( nav: Navigation, item: NavItem ) {
  itemMoveDownHelper(nav.items, item);
}

function itemMoveDownHelper( items: NavItem[], item: NavItem ):
  boolean
{
  const index = items.findIndex( x => x.id == item.id )
  if( index == items.length-1 ) return false;
  if( index != -1 ) {
    const temp = items[index+1];
    items[index+1] = items[index];
    items[index] = temp;
    return true;
  }
  for( const subSearch of items ) {
    if( itemMoveDownHelper( subSearch.subItems, item ) ) {
      return true;
    }
  }
  return false;
}

export function renderPaths(
  nav: Navigation,
  hierarchicalPaths: boolean,
  parentPath?: string,
):
  Navigation
{
  return {
    ...nav,
    items: renderPathsItems( nav.items, hierarchicalPaths ),
  }
}

export function renderPathsItems(
  items: NavItem[],
  hierarchicalPaths: boolean,
  parentPath?: string,
):
  NavItem[]
{
  return items.map( item => {
    const path = renderPath( item, hierarchicalPaths, parentPath );
    return {
      ...item,
      path: path,
      subItems: renderPathsItems( item.subItems, hierarchicalPaths, path),
    }
  } );
}

export function renderPath(
  item: NavItem,
  hierarchicalPaths: boolean,
  parentPath?: string,
):
  string
{
  let path = `/${ item.path }`;
  if( hierarchicalPaths && parentPath )
    path = joinPaths( parentPath, item.path );
  return path;
}

function joinPaths( p1: string, p2: string ) {
  const trimmed1 = p1.replace( /\/+$/g, '');
  const trimmed2 = p2.replace( /^\/+/g, '');
  return `${ trimmed1 }/${ trimmed2 }`;
}
