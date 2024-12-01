import { Strapi } from '@strapi/strapi';

import { Config } from './config';

export default ({ strapi }: { strapi: Strapi }) => {
  const config: Config = strapi.config.get('plugin.sghp-nav');
  const relatedType = config.relatedType as any; // <- fix type safety
  strapi.contentType( 'plugin::sghp-nav.item' ).attributes.related = {
    "type": "relation",
    relation: "oneToOne",
    target: relatedType,
  };
};
