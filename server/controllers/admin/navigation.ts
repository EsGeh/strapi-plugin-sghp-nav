import { factories } from '@strapi/strapi';

import * as utils from '@strapi/utils';


export default factories.createCoreController('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async renderAdmin(ctx) {
    const query = await this.sanitizeQuery( ctx );
    try {
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminNav' ).renderAdmin(
        query
      );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async updateAdmin(ctx) {
    const query = await this.sanitizeQuery( ctx );
    try {
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminNav' )
        .updateAdmin(
          ctx.request.body,
          query,
      );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async createLocalization(ctx) {
    const query = await this.sanitizeQuery( ctx );
    try {
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminNav' )
        .createLocalization(
          ctx.request.body,
          query,
      );
    }
    catch (err) {
      console.error( err );
      ctx.throw(500, err);
    }
  }

} ));
