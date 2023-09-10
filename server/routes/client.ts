export default {
  type: "content-api",
  routes: [
    {
      method: 'GET',
      path: '/render',
      handler: 'clientNav.render',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/navigation',
      handler: 'clientNav.find',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
