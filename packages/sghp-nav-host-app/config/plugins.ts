export default {
  'sghp-nav': {
    enabled: true,
    resolve: './src/plugins/sghp-nav',
    config: {
      relatedType: 'api::page.page',
      relatedDisplayField: 'title',
      hierarchicalPaths: true,
    }
  },
}

