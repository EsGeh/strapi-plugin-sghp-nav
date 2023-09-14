import * as types from '../../types/client';
import { Config } from '../../config';
import * as utils from './../utils'
import * as typeUtils from '../../types/utils';

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { Relation } from '@strapi/icons';
import { merge } from 'lodash';


export default factories.createCoreService('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async render(
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
    // console.log( `findArgs: ${ JSON.stringify( findArgs, null, 2) }` );

    /* we dont actually know "typeof findArgs"
     * because we dont know how the related
     * field is populated.
     * We therefore assume a type
     * that is close enough.
     */

    const navData: types.FindReturn<any, typeof Private.findRawArgsWithRelated> = await this.find(
      findArgs
    );
    if( !navData ) {
      throw new errors.NotFoundError('Navigation not found');
    }
    const renderedItems = typeUtils.renderPathsItems(
      utils.fromFlatItems(
        navData.items
      ),
      config.hierarchicalPaths,
    );
    return {
      ...navData,
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

  /*
  async testRender() {
    let t: types.RenderReturn<{bla: 10}> = await this.render();
    t.items[0].related
  },

  async testFind() {
    let t: types.FindReturn<{ bla: 10},typeof Private.findRawArgsWithRelated> = await this.find(findRawArgs);
    t.items[0].related.bla
  },
  */

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
