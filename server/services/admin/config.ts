import { Config } from '../../config';

import { Strapi } from '@strapi/strapi';


export default ({ strapi }: { strapi: Strapi }) => ({
  find: async () => {
    const config: Config = strapi.config.get('plugin.sghp-nav');
    return config;
  },
});
