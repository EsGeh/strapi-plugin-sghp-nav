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
  ):
    Promise<types.Navigation>
  {
    const config: Config = strapi.config.get('plugin.sghp-nav');
    let populateRelated = true;
    if( params.populateRelated ) {
      populateRelated = params.populateRelated;
    }
    const findArgs = merge(
      {
        populate: {
          items: utils.populateItemsRender(populateRelated),
        }
      },
      params,
    );
    const navData = await this.find( findArgs );
    if( !navData ) {
      throw new errors.NotFoundError('Navigation not found');
    }
    if( !navData.items )
      return navData;
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

}));
