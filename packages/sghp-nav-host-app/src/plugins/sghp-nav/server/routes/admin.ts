export default {
  type: "admin",
  routes: [
    {
      method: 'POST',
      path: '/navigation/localizations',
      handler: 'adminNav.createLocalization',
      config: {
        policies: [],
        auth: false,
      },
    },
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
      handler: 'adminNav.createAdmin',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/navigation/:id',
      handler: 'adminNav.updateAdmin',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/navigation/:id',
      handler: 'adminNav.deleteAdmin',
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
      method: 'PUT',
      path: '/navigation/item/:id',
      handler: 'adminItem.update',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/navigation/item',
      handler: 'adminItem.create',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
