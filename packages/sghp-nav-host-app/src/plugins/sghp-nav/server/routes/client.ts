export default {
  type: "content-api",
  routes: [
    {
      method: 'GET',
      path: '/navigations/render',
      handler: 'clientNav.renderAll',
      config: {
        policies: [],
        auth: false,
      },
    },
    /* legacy:
     * return as if singleton type (only "Main" navigation)
     */
    {
      method: 'GET',
      path: '/render',
      handler: 'clientNav.renderMain',
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
