import pluginId from "./pluginId";
import { FrontNav, FrontNavItem, Locale, } from './types'
import * as utils from './utils'
import * as backendTypes from '../../server/types/admin';
import { Config } from '../../server/config';

import { getFetchClient, request, } from '@strapi/helper-plugin';

const qs = require( "qs" );


export async function get(
  locale?: string,
):
  Promise<FrontNav[]>
{
  const client = getFetchClient();
  let query: { [k:string]: any } = {}
  if( locale ) { query.locale = locale;}
  const queryString = qs.stringify( query );

  const response: { data: backendTypes.Navigation[] } = await client.get( `/${pluginId}/navigation?${ queryString }`);
  return response.data.map( utils.navFromBackend );
};

export type NavInfo = {
  name: string,
  id: number,
}

export async function getConfig(
  locale?: string,
):
  Promise<Config>
{
  const client = getFetchClient();
  const res: { data: Config } = await client.get( `/${pluginId}/config`);
  return res.data;
}

export async function getLocales():
  Promise<Locale[]>
{
  const client = getFetchClient();
  const res = await client.get( `/i18n/locales`);
  return res.data;
};

export async function addNavigation(
  { locale, name }
  : {
    locale?: string,
    name?: string,
  }
):
  Promise<FrontNav[]>
{
  const client = getFetchClient();
  let query: { [k:string]: any } = {}
  if( locale ) { query.locale = locale;}
  const queryString = qs.stringify( query );

  name = name || "Main";

  const payload = {
    // data: {
      name: name,
      ...(
        locale ? { locale: locale } : {}
      ),
    // }
  }
  await client.post( `/${pluginId}/navigation`, payload );
  return await get( locale );
}

export async function del(
  id: number
) {
  const client = getFetchClient();
  await client.del( `/${pluginId}/navigation/${ id }` );
}
export async function addLocalization(
  { locale, name }
  : {
    locale?: string,
    name?: string,
  }
):
  Promise<FrontNav[]>
{
  const client = getFetchClient();
  let query: { [k:string]: any } = {}
  if( locale ) { query.locale = locale;}
  const queryString = qs.stringify( query );

  name = name || "Main";

  const payload = {
    // data: {
      name: name,
      ...(
        locale ? { locale: locale } : {}
      ),
    // }
  }
  await client.post( `/${pluginId}/navigation/localizations`, payload );
  return await get( locale );
}

export async function addItem(
  item: Omit<FrontNavItem,"id">,
  navId: number,
  parent?: FrontNavItem,
  locale?: string,
):
  Promise<FrontNav[]>
{
  // console.debug( `admin.src.api.addItem: item: ${ JSON.stringify( item ) }, parent: ${ JSON.stringify( parent ) }` );
  const client = getFetchClient();
  let dataToSend: { [k:string]: any } = {
    ...item,
    master: navId,
  }
  if( parent ) { dataToSend.parent = parent.id; }
  if( item.related ) { dataToSend.related = item.related.id; }
  if(locale ) { dataToSend.locale = locale }
  try {
    await client.post( `/${pluginId}/navigation/item`, {
      data: dataToSend
    });
    return await get( locale );
  }
  catch( e ) {
    console.error( e );
    throw e;
  }
};

export async function updateItem(
  item: FrontNavItem,
  locale?: string,
):
  Promise<FrontNav[]>
{
  // console.debug( `admin.src.api.updateItem: item: ${ JSON.stringify( item ) }` );
  const client = getFetchClient();
  let dataToSend: Omit<FrontNavItem, "id"|"removed"|"subItems"> = {
    ...item,
  }
  delete dataToSend[ "id" ];
  delete dataToSend[ "removed" ];
  delete dataToSend[ "subItems" ];
  try {
    await client.put( `/${pluginId}/navigation/item/${ item.id }`, {
      data: dataToSend
    } );
    return await get( locale );
  }
  catch( e ) {
    console.error( e );
    throw e;
  }
};

export async function update(
  data: FrontNav,
  locale?: string,
):
  Promise<FrontNav[]>
{
  const client = getFetchClient();
  const dataToSend = {
    ...data,
    items: applyRemove( data.items )
  };
  let query: { [k:string]: any } = {}
  if( locale ) { query.locale = locale;}
  const queryString = qs.stringify( query );
  try {
    await client.put( `/${pluginId}/navigation/${ data.id }?${ queryString }`, dataToSend );
    return await get( locale );
  }
  catch( e ) {
    console.error( e );
    throw e;
  }
};

function applyRemove( items: FrontNavItem[] ) {
  return items.filter(item => !item.removed).map( item => {
    return {
      ...item,
      subItems: applyRemove( item.subItems ),
    };
  })
}
