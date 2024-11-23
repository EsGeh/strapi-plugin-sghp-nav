import { Relation } from '@strapi/icons';
import * as types from '../../types/admin';
import * as typeUtils from '../../types/utils';
import { Config } from '../../config';
import * as utils from '../utils'

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';


export default factories.createCoreService('plugin::sghp-nav.item', ({ strapi }) =>  ({

  // implicitly update
  // 'master' and 'order' properties
  async create( params )
  {
    const config: Config = strapi.config.get('plugin.sghp-nav');
    // locale -> master navigation
    let nav: types.Navigation
    {
      let getNavArgs: { [k:string]: any} = {};
      if( params.data?.locale ) {
        getNavArgs.locale = params.data?.locale;
      }
      const navs: types.Navigation[] = await strapi.service("plugin::sghp-nav.adminNav").renderAdmin( getNavArgs );
      nav = navs.find( x => (x.id == params.data.master) );
    }
    if( !nav ) {
      throw new errors.NotFoundError('Navigation not found');
    }
    let itemToAdd = {
      ...params.data,
      master: nav.id,
    };
    // Check if operation leads to valid results:
    const parentId: number|undefined = params.data.parent;
    const parent = typeUtils.findItem( nav, (item) => (item.id === parentId) );
    const order = typeUtils.addItem( nav, itemToAdd, parent );
    itemToAdd.order = order;
    const validationErrors: string[] = typeUtils.validate( nav, config.hierarchicalPaths );
    if( validationErrors.length > 0 ) {
      throw new errors.ValidationError(`invalid navigation data: ${ validationErrors.join() }`);
    }
    await strapi.entityService.create('plugin::sghp-nav.item', {
      data: itemToAdd,
    });
  },

  async getNavigationFromItem(
    itemId: number,
  ):
    Promise<types.Navigation>
  {
    const config: Config = strapi.config.get('plugin.sghp-nav');
    let master: utils.NavFromDB
    {
      let itemRequest = await strapi.entityService.findOne( "plugin::sghp-nav.item", itemId, {
        populate: {
          master: {
            populate: {
              items: utils.populateItemsRender(),
            },
            localizations: "*",
          }
        }
      });
      master = itemRequest.master;
    };
    const ret = await strapi.service( 'plugin::sghp-nav.adminNav' ).getNavigationFromFlat(
      master
    );
    return ret;
  },

  async update(
    entityId: number,
    params: { data: Partial<types.NavItem> },
  )
  {
    const config: Config = strapi.config.get('plugin.sghp-nav');
    const item = params.data;
    const nav = await this.getNavigationFromItem( entityId );
    const oldItem = typeUtils.findItemById(
      nav,
      entityId,
    );
    for( const fieldName of ["title", "path", "related"] ) {
      if( item[fieldName] )
        oldItem[fieldName] = item[fieldName];
    }
    // Check if operation leads to valid results:
    const validationErrors: string[] = typeUtils.validate( nav, config.hierarchicalPaths );
    if( validationErrors.length > 0 ) {
      throw new errors.ValidationError(`invalid navigation data: ${ validationErrors.join() }`);
    }
    return super.update( entityId, {
      data: item
    });

  },

}));
