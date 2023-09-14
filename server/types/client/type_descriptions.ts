import {
  RestReturn,
  SubArgs,
  Shortcut,
} from "./type_utils";

export {
  RestReturn,
  SubArgs,
  Shortcut,
} from "./type_utils";

/*

Example:

const restArgs = {
  fields: ["name"],
  populate: {
    "items": {
      fields: ["title", "path"],
      populate: ["related", "subItems"],
    },
    localizations: true,
  }
} as const;

type ArgsType = typeof restArgs;

type Nav = Shortcut<NavRest>;

type NavRest = RestReturn<
  NavigationAttributes,
  NavigationRelations<any,ArgsType>,
  ArgsType
>

*/

export type NavigationAttributes = {
  name: string,
  locale: string,
}

export type NavigationRelations<Related,Args> =
  {
    items: {
      data: RestReturn<
        NavItemAttributes,
        NavItemRelations<Related,SubArgs<"items",Args>>,
        SubArgs<"items",Args>
      >[]
    }
  } & {
    localizations: {
      data: {
        id: number,
        name: string,
        locale: string,
      }[]
    }
  }

export type NavItemAttributes = {
  title: string,
  path: string,
}

export type NavItemRelations<Related,Args> =
  {
    subItems: {
      data: RestReturn<
        NavItemAttributes,
        NavItemRelations<Related, SubArgs<"subItems",Args>>,
        SubArgs<"subItems",Args>
      >[]
    }
  } & {
    parent: {
      data: RestReturn<
        NavItemAttributes,
        NavItemRelations<Related,SubArgs<"parent",Args>>,
        SubArgs<"parent",Args>
      >|null
    }
  /*
  } & {
    related: {
      data: RestReturn<
        NavItemAttributes,
        NavItemRelations<Related,SubArgs<"related",Args>>,
        SubArgs<"related",Args>
      >|null
    }
  */
  } & {
    related: {
      data: Related|null,
    }
  }
