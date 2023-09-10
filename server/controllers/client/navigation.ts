import { factories } from '@strapi/strapi';

import * as utils from '@strapi/utils';


export default factories.createCoreController('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async render(ctx) {
    const query = await this.sanitizeQuery( ctx );
    try {
      ctx.body = await strapi.service( 'plugin::sghp-nav.clientNav' ).render(
        query
      );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

} ));
