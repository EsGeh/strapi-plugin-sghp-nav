/* Removes the indirection
 * via "attributes" and "data"
 * fields from a strapi rest
 * response
 */
export type Shortcut<T> = ShortcutAttrs<T>;

/*
  {
    id: number,
    attributes: {
      name: string,
      items: { data: ... }
      ...
    }
  }
    ->
  {
    id: number,
    name: string,
    items: { data: ... }
    ...
  }
*/
type ShortcutAttrs<T> =
  T extends { attributes: any }
  ?
    Omit<T, "attributes">
    & MapShortcutData<T["attributes"]>
  : T
;

/*
  {
    name: string,
    items: { data: { id: number, title: string }[] }
    ...
  }
    ->
  {
    name: string,
    items: { id: number, title: string }[]
    ...
  }
*/
type MapShortcutData<T> =
  T extends {}
  ? {
    [F in keyof T]: ShortcutData<T[F]>
  }
  : T
;

/*
    { data: { id: number, title: string }[] }
    ->
    { id: number, title: string }[]

    but:
    string -> string, ...
  }
*/
type ShortcutData<T> =
  T extends { data: (infer Val)[] } ? ShortcutAttrs<Val>[]
  : T extends { data: (infer Val)|null } ? ShortcutAttrs<Val>|null
  : T
;

export type RestReturn<
  Attributes,
  Relations,
  RestArgs,
  DefAttrs extends keyof Attributes = keyof Attributes,
  DefRelations extends keyof Relations = never,
> =
  {
    id: number,
    attributes:
      Pick<Attributes, FieldsFromArgs<Attributes, DefAttrs, RestArgs>>
      & Pick<Relations, RelationsFromArgs<Relations,DefRelations, RestArgs>>
    ,
  }
;

export type SubArgs<FieldName extends string, RestArgs> =
  RestArgs extends { populate: infer Populate }
  ? Populate[(keyof Populate) & FieldName]
  : {};

type FieldsFromArgs<
  Attributes,
  DefAttrs extends keyof Attributes,
  RestArgs,
> =
  RestArgs extends { fields: readonly (infer Fields)[] }
  ? Extract<keyof Attributes, Fields>
  : DefAttrs
;

type RelationsFromArgs<
  Relations,
  Def extends keyof Relations,
  RestArgs,
> =
  RestArgs extends { populate: readonly (infer Fields)[] } ? Extract<keyof Relations, Fields>
  : RestArgs extends { populate: infer Fields } ? Extract<keyof Relations, keyof Fields>
  : Def
;
