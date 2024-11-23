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

  async createAdmin(ctx) {
    const query = await this.sanitizeQuery( ctx );
    const data = {
      ...ctx.request.body
    };
    try {
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminNav' )
        .createAdmin(
          data,
          query,
      );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async updateAdmin(ctx) {
    const query = await this.sanitizeQuery( ctx );
    const id = JSON.parse(ctx.params.id);
    const data = {
      ...ctx.request.body,
      id: undefined,
    };
    try {
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminNav' )
        .updateAdmin(
          id,
          data,
          query,
      );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async deleteAdmin(ctx) {
    const query = await this.sanitizeQuery( ctx );
    const id = JSON.parse(ctx.params.id);
    const data = {
      ...ctx.request.body,
    };
    try {
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminNav' )
        .deleteAdmin(
          id
      );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async createLocalization(ctx) {
    // console.log( `admin.controllers.createLocalization data: ${ JSON.stringify( ctx, null, 2) }` );
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
