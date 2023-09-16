import {
  RestReturn,
  SubArgs,
  Shortcut,
} from "./type_utils";

import * as typeDescr from "./type_descriptions";

export type {
  RestReturn,
  SubArgs,
  Shortcut,
} from "./type_utils";

export * from "./type_descriptions";



/* Related refers to
 * the expected record in
 * the response.
 * It cannot be known beforehand
 * since the corresponding population
 * parameter is only known
 * at runtime.
 *  never: don't populate
 *  any: no typechecking for related
 *  <some type>: I know how "related" is populated
 */
export type RenderReturn<Related = never> =
  Shortcut<RenderReturnRest<Related>>
;

export type RenderReturnRest<Related = never> =
  [Related] extends [never]
  ?
  NestedNavFromNormal<
    FindReturnRest<Related,RenderArgsNoRelated>
  >
  :
  NestedNavFromNormal<
    FindReturnRest<Related,RenderArgsWithRelated>
  >
;

type NestedNavFromNormal<Nav> =
  ReplaceFieldRec<
    Nav,
    "items",
    {
      data:
        NestedFromSimpleItem<
          GetItemType< Nav >
        >[]
    }
  >
;

type GetItemType<Nav> =
  Nav extends {
    attributes: {
      items: {
        data: (infer FlatItemType)[]
      }
    }
  }
  ? FlatItemType
  : never
;

type NestedFromSimpleItem<T> =
  T extends { attributes: any }
  ? {
    id: number,
    attributes: T["attributes"] & {
      subItems: {
        data: NestedFromSimpleItem<T>[]
      }
    }
  }
  : T
;

export type FindReturn<Related,FindArgs> = Shortcut<FindReturnRest<Related,FindArgs>>;

export type FindReturnRest<Related,FindArgs> = RestReturn<
  typeDescr.NavigationAttributes,
  typeDescr.NavigationRelations<Related,FindArgs>,
  FindArgs
>

const renderArgs = {
  populate: {
    items: {
      populate: {
        // subItems: true,
        // related: true,
      }
    },
    localizations: true,
  }
} as const;

const renderArgsWithRelated = {
  populate: {
    items: {
      populate: {
        // subItems: true,
        related: true,
      }
    },
    localizations: true,
  }
} as const;

type RenderArgsNoRelated = typeof renderArgs;
type RenderArgsWithRelated = typeof renderArgsWithRelated;


/* Utils */

type ReplaceFieldRec<T, Key, New> =
  Key extends keyof T ? (Omit<T,Key> & Record<Key,New> )
  : {
    [F in keyof T]:
      ReplaceFieldRec<T[F],Key,New>
  }
;
