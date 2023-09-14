import {
  RestReturn,
  SubArgs,
  Shortcut,
} from "./type_utils";

import * as typeDescr from "./type_descriptions";

export {
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
  ReplaceFieldRec<
    FindReturnRest<Related,RenderArgsNoRelated>,
    "subItems",
    FindReturnRest<Related,RenderArgsNoRelated>["attributes"]["items"]
  >
  :
  ReplaceFieldRec<
    FindReturnRest<Related,RenderArgsWithRelated>,
    "subItems",
    FindReturnRest<Related,RenderArgsWithRelated>["attributes"]["items"]
  >
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
        subItems: true,
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
        subItems: true,
        related: true,
      }
    },
    localizations: true,
  }
} as const;

type RenderArgsNoRelated = typeof renderArgs;
type RenderArgsWithRelated = typeof renderArgsWithRelated;

type ReplaceFieldRec<T, Key, New> =
  Key extends keyof T ? (Omit<T,Key> & Record<Key,New> )
  : {
    [F in keyof T]:
      ReplaceFieldRec<T[F],Key,New>
  }
;
