import { Relation } from '@strapi/icons';
import * as types from '../../types/admin';
import { Config } from '../../config';
import * as utils from '../utils'
import * as typeUtils from '../../types/utils';

import { EntityService, factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { merge } from 'lodash';
const { prop, map, } = require('lodash/fp');



export default factories.createCoreService('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async renderAdmin(
    params
  ):
    Promise<types.Navigation[]>
  {
    // console.log( `services.admin.navigation.renderAdmin: ${ JSON.stringify( params ) }` );
    const config: Config = strapi.config.get('plugin.sghp-nav');
    const findArgs = merge(
      {
        populate: {
          items: utils.populateItemsRender(),
          locale: "*",
          localizations: "*",
        },
      },
      params,
    );
    let findRet: { results: utils.NavFromDB[] } = await this.find( findArgs );
    const renderedNavs: types.Navigation[] = await Promise.all(findRet.results.map( async (navData) : Promise<types.Navigation> => {
      return await this.getNavigationFromFlat( navData, params?.locale );
    }));
    return renderedNavs;
  },

  async getNavigationFromFlat(
    navData: utils.NavFromDB,
    locale?: string,
  ):
    Promise<types.Navigation>
  {
    // console.log( `services.admin.navigation.getNavigationFromFlat: ${ JSON.stringify( navData ) }` );
    const config: Config = strapi.config.get('plugin.sghp-nav');
    const relatedEntities: { [key:string]: any } = await strapi.entityService.findMany( config.relatedType, {
      populate: ['id', config.relatedDisplayField],
      ...( locale ? { locale } : {} ),
    });
    const renderedItems = utils.adminRenderRelated(
      utils.fromFlatItems(
        navData.items,
      ),
      config.relatedDisplayField,
    );
    return {
      ...navData,
      items: renderedItems,
      relatedEntities: relatedEntities.map( entity => ( {
        id: entity.id,
        displayName:
          entity[config.relatedDisplayField] ?? entity.id,
      } ) ),
    }
  },

  async updateAdmin(
    entityId: number,
    data: types.Navigation,
    params,
  ) {
    // console.log( `admin.service.updateAdmin id: ${ JSON.stringify( entityId ) }` );
    const config: Config = strapi.config.get('plugin.sghp-nav');
    const validationErrors: string[] = typeUtils.validate( data, config.hierarchicalPaths );
    if( validationErrors.length > 0 ) {
      throw new errors.ValidationError(`invalid navigation data: ${ validationErrors.join() }`);
    }
    const navData: types.Navigation = await this.findOne( entityId, {
      populate: {
          items: utils.populateItemsRender(),
        locale: "*",
        localizations: "*",
      },
      ...params,
    } );
    if( !navData ) {
      throw new errors.NotFoundError('Navigation not found');
    }
    if( data.name !== navData.name ) {
      await strapi.entityService.update('plugin::sghp-nav.navigation', entityId, data);
    }
    const flatItems = utils.toFlatItems( data.items );
    let updates = [];
    // DELETES:
    const itemsToDel = navData.items.filter( item => ! flatItems.find( x => x.id === item.id ) );
    itemsToDel.forEach( item => {
      updates.push(
        strapi.entityService.delete('plugin::sghp-nav.item', item.id)
      );
    });
    flatItems.forEach( item => {
      // CREATE:
      if( ! navData.items.find( x => x.id === item.id  ) ) { }
      // UPDATE
      else {
        const update = {
          title: item.title,
          path: item.path,
          order: item.order,
        }
        updates.push(
          strapi.entityService.update('plugin::sghp-nav.item', item.id, { data: {
            ...update,
          } })
        );
      }
    });
    await Promise.all( updates );
  },

  async createAdmin(
    data: Pick<types.Navigation,"name"|"locale">,
  ) {
    // console.log( `admin.service.createAdmin data: ${ JSON.stringify( data, null, 2) }` );
    if( !data.name || !data.locale ) {
      throw new errors.NotFoundError('expected: { name, locale }');
    }
    const newEntry = await strapi.entityService.create('plugin::sghp-nav.navigation', {
      data: data,
    });
    return newEntry;
  },

  async createLocalization(
    data: Pick<types.Navigation,"name"|"locale">,
  ) {
    // console.log( `admin.service.createLocalization data: ${ JSON.stringify( data, null, 2) }` );
    const contentType = strapi.contentTypes['plugin::sghp-nav.navigation'];
    const entry = await strapi.query(contentType.uid).findOne({ populate: ['localizations'] });
    const getAllLocales = (entry) => {
      return [entry.locale, ...map(prop('locale'), entry.localizations)];
    };
    const getAllLocalizationsIds = (entry) => {
      return [entry.id, ...map(prop('id'), entry.localizations)];
    };

    if( !entry ) {
      throw new errors.NotFoundError();
    }
    const i18nPlugin = strapi.plugin("i18n");
    const findByCode = i18nPlugin.services.locales.findByCode;
    const matchingLocale = await findByCode( data.locale );
    if (!matchingLocale) {
      throw new errors.ApplicationError('locale is invalid');
    }
    const usedLocales = getAllLocales(entry);
    if (usedLocales.includes(data.locale)) {
      throw new errors.ApplicationError('locale is already used');
    }

    const sanitizedData = {
      name: data.name,
      locale: data.locale,
      localizations: getAllLocalizationsIds(entry),
    }
    const newEntry = await strapi.entityService.create( contentType.uid, {
      data: sanitizedData,
      populate: ['localizations'],
    });
    return newEntry;
  },

  async deleteAdmin(
    entityId: number,
  ) {
    const contentType = strapi.contentTypes['plugin::sghp-nav.navigation'];
    await strapi.entityService.delete( contentType.uid, entityId );
  },

}));
