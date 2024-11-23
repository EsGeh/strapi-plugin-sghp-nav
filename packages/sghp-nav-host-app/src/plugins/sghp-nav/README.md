# Strapi plugin sghp-nav

Plugin for [Strapi](https://strapi.io/) to create, edit and retrieve website navigation structure.

![screenshot of graphical user interface](./doc/screenshot.png)

# Features:

- Graphical user interface for editing site navigation
- i18n, Nationalization: seperate navigation for every locale
- Configurable via config file
- Strapi conformant REST API to fetch hierarchical menu data
- Typescript types for REST responses included
- Navigation items may be associated with a custom content type (ie. that represents a page or section on your website)
- Import / Export of navigation structure via strapis native command line tools

# Requirements

- Strapi 4.13 or later

# Installation

1. Install package from npm:

    - Install via npm:

            $ npm install @sgsoftware/strapi-plugin-sghp-nav

    - Install via yarn:

            $ yarn add @sgsoftware/strapi-plugin-sghp-nav

2. [Create the necessary configuration](#configuration) as described below.

3. Recompile admin

    $ npm run build

The plugin should now be ready.
Use the admin interface to create or edit navigation structure. To open the navigation gui, click on the corresponding entry in the side navigation under `Plugins`.
[Query](#query) navigation data via REST.

# Configuration

Add plugin config to `./config/plugins.ts` (create, if not yet existing):

    ...
    'sghp-nav': {
      enabled: true,
      config: {
        relatedType: 'api::page.page',
        relatedDisplayField: 'title',
        hierarchicalPaths: true,
      }
    }

Adjust the values as necessary!

Configuration Options:

- `relatedType`: Menu entries may be associated with entities of a custom content type, e.g. a subpage. Refers to a content type via "strapi uid" in the same format as in [strapis entity service api](https://docs.strapi.io/dev-docs/api/entity-service). `$ npm run strapi content-types:list` lists all content types.
- `relatedDisplayField`: a field of the related type used to display related content in the graphical user interface
- `hierarchicalPaths`: Menu entries consist of a title and a path. The path must be unique. If `hierarchicalPaths` is true, the path of subentries is the concatenation with the path of their parents, e.g. if `/productX` is a subentry of `/products`, the full path is `/products/productX`

# Graphical User Interface

# REST API

Example Query:

  $ curl -X GET 'http://localhost:1337/api/sghp-nav/navigations/render'

  // deprecated legacy call:
  // $ curl -X GET 'http://localhost:1337/api/sghp-nav/render'

Example Response:

    {
      "data": [
        {
          "id": 2,
          "attributes": {
            "name": "Main",
            "createdAt": "2023-09-15T13:07:45.827Z",
            "updatedAt": "2023-09-22T11:46:45.572Z",
            "locale": "en",
            "items": {
              "data": [
                {
                  "id": 1,
                  "attributes": {
                    "title": "Home",
                    "path": "/",
                    "related": {
                    },
                    "subItems": {
                      "data": []
                    }
                  }
                },
                {
                  "id": 5,
                  "attributes": {
                    "title": "Products",
                    "path": "/products",
                    "related": {
                    },
                    "subItems": {
                      "data": [
                        {
                          "id": 6,
                          "attributes": {
                            "title": "Product X",
                            "path": "/products/product-x",
                            "related": {
                            },
                            "subItems": {
                              "data": []
                            }
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "id": 2,
                  "attributes": {
                    "title": "Contact",
                    "path": "/contact",
                    "related": {
    
                    },
                    "subItems": {
                      "data": []
                    }
                  }
                }
              ]
            },
            "localizations": {
              "data": [
                {
                  "id": 3,
                  "attributes": {
                    "name": "Main",
                    "createdAt": "2023-09-22T11:46:45.523Z",
                    "updatedAt": "2023-09-22T11:46:45.523Z",
                    "locale": "de"
                  }
                }
              ]
            }
          }
        },
        // other Menus (footer, etc)...
      ],
      "meta": {
      }
    }

Request Format:

    http://localhost:1337/api/sghp-nav/navigations/render?<PARAMS>

Get Params:

- `locale`: Query the navigation for a specific locale. If unspecified, returns default locale
- `populateRelated`: specifies what information to return for related entities. The format is exactly as in a [REST request](https://docs.strapi.io/dev-docs/api/rest/parameters) for the corresponding content type. Most notable operators are: `populate` and, `fields`.

# Query from Frontend

There is a npm package that provides the correct typings for the REST response.
To install it, `cd` to your prontend package and issue:

- Install via npm:

        $ npm install @sgsoftware/strapi-plugin-sghp-nav-front

- Install via yarn:

        $ yarn add @sgsoftware/strapi-plugin-sghp-nav-front

The following code snipped shows how to fetch navigation data from the strapi backend via REST.

Example code:

    // IMPORTS:
    import * as navTypes from "@sgsoftware/strapi-plugin-sghp-nav-front";  <- (1)
    const qs = require( "qs" );

    // CONSTANTS:
    const backendUrl = "http://127.0.0.1:1337" // <- adjust as needed

    const apiUrl = backendUrl + "/api" ;

    const pageParams = {
      populate: [
        "localizations",
        // ...
      ],
      // fields: ...
    } as const;

    // TYPES:

    type Navigation = navTypes.RenderReturnRest<Page>;
    type NavigationItem = Navigation["attributes"]["items"]["data"][number];

    type Page = {
      attributes: {
        /* just as an example:
        title: string | null,
        content: string | null,
        */
        localizations: {
          data: {
            locale: string | null,
          }[]
        }
      }
    }

    export interface Locale { 
      name: string,
      code: string,
      isDefault: boolean,
    };

    // FUNCTIONS:
    export async function getNavigation(
      locale: string|null = null,
    ):
      Promise<Navigation>
    {
      const apiKey = "sghp-nav/render";
      let queryObj: Record<string, any> = {
        populateRelated: pageParams
      }
      if( locale ) {
        queryObj.locale = locale;
      }
      const query = qs.stringify( queryObj );
      const url: string = `${apiUrl}/${apiKey}?${ query }`;
      const response = await fetch( url );
      if( ! response?.ok ) {
        throw new Error( `Error when fetching data from '${url}': returned HTTP status '${response.status}'` );
      }
      const data = await response.json();
      if( !data ) {
        throw new Error( `Error when fetching data from '${url}': no data!` );
      }
      return data as Navigation;
    }

Eplanation:

The example code uses the fetch api to query the REST API. We import the typescript type for the response from the frontend package.
Since the format of the response data depends on the `populateRelated` parameter, `RenderReturnRest<Related>` takes the type of the response for the related entity as a type parameter.

In order for the related type definition (in the example `Page`) to be useful, it must closely correspond with the `populateRelated` parameter as the data depends on `populateRelated.fields` and `populateRelated.populate`.
This is the point, where you are on your own.

You may consider to use the groundbreaking [types-4-strapi-2](https://github.com/Oak-Digital/types-4-strapi-2) library to automatically derive such types from the populate parameter as is conceptually described [here](https://github.com/Oak-Digital/types-4-strapi-2#population).

# Contribution

Comments, bug reports and pull requests welcome.
Work in Progress...
This project is far from complete but effort has been taken in well structured code that should be easy to extend and improve.

This plugin was born from practical considerations and aims to close some gaps of other existing solutions which seemed to fail the folllowing requirements (as of 2023-09-11):

- Import / Export via strapis native command line tools ([without breaking relations](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation/issues/317))
- Internationalization (missing in `strapi-plugin-menus`)

# References

- [strapi-plugin-navigation](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation)
- [strapi-plugin-menus](https://github.com/mattmilburn/strapi-plugin-menus)
- [types-4-strapi-2](https://github.com/Oak-Digital/types-4-strapi-2) 
