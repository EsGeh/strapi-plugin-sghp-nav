import { factories } from '@strapi/strapi';

import * as utils from '@strapi/utils';


export default factories.createCoreController('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async renderMain(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const results = await strapi.service('plugin::sghp-nav.clientNav').renderMain( sanitizedQueryParams );
    const sanitizedResults = results;
    return this.transformResponse( sanitizedResults );
  },

  async renderAll(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const results = await strapi.service('plugin::sghp-nav.clientNav').renderAll( sanitizedQueryParams );
    const sanitizedResults = results;
    return this.transformResponse( sanitizedResults );
  },

  /* also every standard function
   * has to be overwritten to use
   * the `clientNav` service
   * (annoying)
   */

  async find(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const results = await strapi.service('plugin::sghp-nav.clientNav').find( sanitizedQueryParams );
    const sanitizedResults = results;
    return this.transformResponse(sanitizedResults);
  },

} ));
