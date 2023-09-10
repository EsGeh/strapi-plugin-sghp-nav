# Strapi plugin sghp-nav

Plugin for [Strapi](https://strapi.io/) to create, edit and retrieve website navigation structure.

# Features:

- Graphical user interface for editing site navigation
- i18n, Nationalization: seperate navigation for every locale
- Configurable via config file
- Navigation items may be associated with a custom content type (that represents a subpage)
- Import / Export of navigation structure via strapis native command line tools

# Installation

Not yet documented (TODO).

# Contribution

Comments, bug reports and pull requests welcome.
Work in Progress...

This plugin was born from practical considerations and aims to close some gaps of other existing solutions which seemed to fail the folllowing requirements (as of 2023-09-11):

- Import / Export via strapis native command line tools ([without breaking relations](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation/issues/317))
- Internationalization (missing in (2))

# References

- (1): [strapi-plugin-navigation](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation)
- (2): [strapi-plugin-menus](https://github.com/mattmilburn/strapi-plugin-menus)
