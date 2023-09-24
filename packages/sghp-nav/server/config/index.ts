
export interface Config {
  relatedType: string,
  relatedDisplayField: string,
  hierarchicalPaths: boolean,
}

export default {
  default: ({env}) => ({
    relatedType: undefined,
    relatedDisplayField: undefined,
    hierarchicalPaths: false,
  }),
  validator(config) {
    if(
      typeof config.relatedType !== 'string'
      && config.relatedType != ""
    ) {
      throw new Error('relatedType must be a string');
    }
    if(
      typeof config.relatedDisplayField !== 'string'
      && config.relatedType != ""
    ) {
      throw new Error('relatedDisplayField must be a string');
    }
    if( typeof config.hierarchicalPaths !== 'boolean' )
      throw new Error('hierarchicalPaths must be boolean');
  },
};
