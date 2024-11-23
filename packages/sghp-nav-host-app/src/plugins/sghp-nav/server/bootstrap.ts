
import { Strapi } from '@strapi/strapi';

const modelUID = 'plugin::sghp-nav.navigation';

export default async ({ strapi }: { strapi: Strapi }) => {
  // console.info( "sghp-nav: creating default navigations..." );
  const locales = await strapi.service( "plugin::i18n.locales" ).find();
  const defaultLocale = await strapi.service( "plugin::i18n.locales" ).getDefaultLocale();
  if( ! defaultLocale ) {
    // necessary in case the i18n plugin hasn't yet been initialized...
    console.log( `SKIPPING: i18n plugin is not initialized yet!` );
    return;
  }
  let mainEntry = await strapi.entityService.findMany( modelUID );
  if( !mainEntry || mainEntry.length == 0 ) {
    console.info( "sghp-nav: creating default navigations..." );
    await strapi.entityService.create( modelUID, {
      data: {
        name: "Main",
        locale: defaultLocale,
      },
    });
  }

};
