import * as types from '../../../../../../../sghp-nav-front/src/types';
import { Config } from '../../config';
import * as utils from './../utils'
import * as typeUtils from '../../types/utils';

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { Relation } from '@strapi/icons';
import { merge } from 'lodash';


export default factories.createCoreService('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async renderAll(
    params
  ) {
    const config: Config = strapi.config.get('plugin.sghp-nav');
    let findArgs: Record<string,any> = merge(
      Private.findRawArgs,
      {
        populate: {
          items: {
            populate: {
              related: params?.populateRelated || false
            }
          }
        }
      }
    );
    if( params.locale ) {
      findArgs.locale = params.locale;
    }

    /* we dont actually know "typeof findArgs"
     * because we dont know how the related
     * field is populated.
     * We therefore assume a type
     * that is close enough.
     */

    const rawFindRet = await this.find(
      findArgs
    );
    const renderedNavs = rawFindRet.results.map( nav => {
      const structuredNavData = utils.fromFlatItems(
        nav.items
      );
      const renderedItems = typeUtils.renderPathsItems(
        structuredNavData,
        config.hierarchicalPaths,
      );
      return {
        ...nav,
        items: renderedItems,
      }
    })
    return renderedNavs;
  },

  async renderMain(
    params
  )
    // : Promise<types.RenderReturn<Related>>
  {
    const config: Config = strapi.config.get('plugin.sghp-nav');
    let findArgs: Record<string,any> = merge(
      Private.findRawArgs,
      {
        populate: {
          items: {
            populate: {
              related: params?.populateRelated || false
              // related: populateRelated,
            }
          }
        }
      }
    );
    if( params.locale ) {
      findArgs.locale = params.locale;
    }

    /* we dont actually know "typeof findArgs"
     * because we dont know how the related
     * field is populated.
     * We therefore assume a type
     * that is close enough.
     */

    const rawFindRet = await this.find(
      findArgs
    );
    let rawNavData: types.FindReturn<any, typeof Private.findRawArgsWithRelated> | null = null;
    if( rawFindRet.results.filter( x=>x.name == "Main") ) {
      rawNavData = rawFindRet.results.filter( x=>x.name == "Main")[0];
    }
    if( !rawNavData ) {
      throw new errors.NotFoundError('Navigation not found');
    }
    const structuredNavData = utils.fromFlatItems(
      rawNavData.items
    );
    const renderedItems = typeUtils.renderPathsItems(
      structuredNavData,
      config.hierarchicalPaths,
    );
    return {
      ...rawNavData,
      items: renderedItems,
    }
  },

  async find(
    params
  )
    // : Promise<types.FindReturn<Related, typeof params>>
  {
    return await super.find( params );
  },

}));

namespace Private {
  export const findRawArgs = {
    populate: {
      items: {
        sort: 'order',
        populate: {
          subItems: {
            fields: ['id'],
            sort: 'order',
          },
          parent: {
            fields: ['id'],
          },
        },
      },
      localizations: true,
    }
  } as const;

  // only needed to calculate types...:
  export const findRawArgsWithRelated = {
    populate: {
      items: {
        sort: 'order',
        populate: {
          subItems: {
            fields: ['id'],
            sort: 'order',
          },
          parent: {
            fields: ['id'],
          },
          related: true
        },
      },
      localizations: true,
    }
  } as const;
}
