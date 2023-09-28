import {
  Navigation,
  NavItem,
} from "./common";

import * as ops from "./operations";

import {cloneDeep} from "lodash";


export function validate(
  nav: Navigation,
  hierarchicalPaths: boolean,
):
  string[]
{
  if( !hierarchicalPaths )
    return validateItems( nav.items );
  else {
    const renderedNav = ops.renderPaths( nav, hierarchicalPaths );
    return validateItems( renderedNav.items );
  }
};

export function validateItems (
  items: NavItem[],
  tabooPaths: string[] = [],
):
  string[]
{
  let paths: string[] = [...tabooPaths];
  let errors: string[] = [];
  items.forEach( item => {
    if( paths.includes( item.path ) ) {
      errors.push( `path not unique!: '${ item.path }'` );
    }
    else {
      paths.push( item.path );
    }
    errors.push(
      ...validateItems(
        item.subItems,
        paths,
      )
    );
  });
  return errors;
}

export function validateAdd(
  nav: Navigation,
  item: NavItem,
  hierarchicalPaths: boolean,
  parent?: NavItem,
):
  string[]
{
  let navCopy = cloneDeep( nav );
  ops.addItem(
    navCopy,
    item,
    parent
  );
  return validate( navCopy, hierarchicalPaths );
}

export function validateEdit(
  nav: Navigation,
  item: NavItem,
  hierarchicalPaths: boolean,
):
  string[]
{
  let navCopy = cloneDeep( nav );
  if( !item.id ) return ["item not found"]
  let itemCopy = ops.findItemById( navCopy, item.id );
  if( !itemCopy ) return ["item not found"]
  for( const [k,v] of Object.entries( item ) ) {
    itemCopy[k] = v;
  }
  return validate( navCopy, hierarchicalPaths );
}
