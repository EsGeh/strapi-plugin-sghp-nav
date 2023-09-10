//import * as types from '../types/admin';
import * as types from "../types/basic";
import { Config } from '../config';

import { Strapi } from '@strapi/strapi';
import { errors } from '@strapi/utils';


export function populateItemsRender( related: boolean= true )
{
  return {
    fields: ["title", "path", ],
    sort: 'order',
    populate: {
      subItems: {
        fields: ['id'],
        sort: 'order',
      },
      parent: {
        fields: ['id'],
      },
      related: related,
    },
  }
};


export type NavFromDB = types.Navigation<NavItemFromDB>;
export type NavItemFromDB = Omit<NavItemFlat, "order">;
export type NavItemToDB = Omit<NavItemFlat, "subItems">;

export type NavItemFlat = Omit<types.NavItemData,"related"> & {
  subItems: { id: number }[],
  parent?: { id: number },
  order: number,
  related: {
    [field: string]: any,
  }|null,
};


export function fromFlatItems(
  itemsRaw: NavItemFromDB[]
):
  types.NavItem[]
{
  let retItems: types.NavItem[] = [];
  // next elements to add.
  // FORMAT: [parentToAddEl, elToAdd]:
  let itemsToAdd: [types.NavItem|null, NavItemFromDB][] = itemsRaw.filter( x => !x.parent ).map( x => [null, x]);
  // descend the menu level by level (breadth first)
  // and add elements:
  while( itemsToAdd.length > 0 ) {
    let added = [];
    let addNext = [];
    for( const [parent, item] of itemsToAdd ) {
      const newEl = {
        id: item.id,
        title: item.title,
        path: item.path,
        related: item.related,
        subItems: [],
      };
      if( !parent ) {
        retItems.push( newEl );
      }
      else {
        if( !parent.subItems ) {
          parent.subItems = [];
        }
        parent.subItems.push( newEl );
      }
      if( item.subItems ) {
        let subItems = [];
        item.subItems.forEach( subRaw => {
          const subItem = itemsRaw.find( i => i.id == subRaw.id );
          if( ! subItem ) { /* log( "inconsistent data!" ); */ }
          else {
            subItems.push( subItem );
          }
        } );
        addNext.push( ...subItems.map( x => [newEl, x] ) );
      }
    }
    itemsToAdd = addNext;
  }
  return retItems;
};

export function adminRenderRelated(
  items: types.NavItem[],
  relatedDisplayField: string,
):
  types.NavItem[]
{
  return items.map( item => ({
    ...item,
    related:
      item.related
      ? {
        id: item.related.id,
        displayName: item.related[relatedDisplayField],
      }
      : null,
    subItems: adminRenderRelated( item.subItems, relatedDisplayField ),
  }));
}

export function toFlatItems( items: types.NavItem[] ):
  NavItemToDB[]
{
  return toFlatItemsHelper( null, items );
}

function toFlatItemsHelper( parent: number|null, items: types.NavItem[] ):
  NavItemToDB[]
{
  let retItems: NavItemToDB[] = [];
  items.forEach( (item, i) => {
    retItems.push( {
      ...item,
      parent: { id: parent } || undefined,
      order: i,
    });
    retItems.push(
      ...toFlatItemsHelper( item.id, item.subItems )
    );
  });
  return retItems;
}
