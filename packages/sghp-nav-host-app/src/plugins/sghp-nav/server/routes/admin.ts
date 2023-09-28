export default {
  type: "admin",
  routes: [
    {
      method: 'GET',
      path: '/navigation',
      handler: 'adminNav.renderAdmin',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/navigation',
      handler: 'adminNav.updateAdmin',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/navigation/localizations',
      handler: 'adminNav.createLocalization',
      config: {
        policies: [],
        auth: false,
      },
    },
    // config:
    {
      method: 'GET',
      path: '/config',
      handler: 'adminConfig.find',
      config: {
        policies: [],
        auth: false,
      },
    },
    // items:
    {
      method: 'POST',
      path: '/navigation/item/:id',
      handler: 'adminItem.update',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/navigation/item',
      handler: 'adminItem.create',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
