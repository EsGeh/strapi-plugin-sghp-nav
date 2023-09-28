import { factories } from '@strapi/strapi';

import { sanitize } from '@strapi/utils';


export default factories.createCoreController('plugin::sghp-nav.item', ({ strapi }) =>  ({

  /* default create would
   * throw away 'related'
   * field.
   * Therefore overwrite:
   */
  async create(ctx) {
    try {
      const data = ctx.request.body.data;
      if( !data ) {
        throw Error("invalid request: empty data");
      }
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminItem' ).create( {
        data: data
      } );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx) {
    const contentType = strapi.contentType('plugin::sghp-nav.item');
    try {
      const params = ctx.params;
      const data = ctx.request.body.data;
      if( !data ) {
        throw Error("invalid request: empty data");
      }
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminItem' ).update(
        JSON.parse(params.id),
        {
          data: data
        } )
      ;
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

}));
