import { Strapi } from '@strapi/strapi';


export default ({ strapi }: { strapi: Strapi }) => ({
  find: async (ctx) => {
    try {
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminConfig' ).find()
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },
});
