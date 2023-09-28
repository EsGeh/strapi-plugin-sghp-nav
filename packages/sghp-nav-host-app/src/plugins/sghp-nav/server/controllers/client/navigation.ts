import { factories } from '@strapi/strapi';

import * as utils from '@strapi/utils';


export default factories.createCoreController('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async render(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const results = await strapi.service('plugin::sghp-nav.clientNav').render( sanitizedQueryParams );
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
    console.log( JSON.stringify( sanitizedQueryParams ) );
    const results = await strapi.service('plugin::sghp-nav.clientNav').find( sanitizedQueryParams );
    const sanitizedResults = results;
    return this.transformResponse(sanitizedResults);
  },

} ));
