/*
 *
 * HomePage
 *
 */

import { FrontNav, FrontNavItem, Locale} from '../../types'
import * as utils from '../../utils'
import * as api from '../../api';
import pluginId from '../../pluginId';
import ItemList from '../../components/List'
import { default as AddNavModal } from '../../components/AddNavModal'
import AddItemModal from '../../components/AddItemModal'
import { Config } from '../../../../server/config';

import React, { useState, useEffect, useReducer } from 'react';
import {
  Main,
  Box,
  Button,
  HeaderLayout,
  ContentLayout,
  EmptyStateLayout,
  Flex,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import { LoadingIndicatorPage } from '@strapi/helper-plugin';
import {
  Check,
  Plus,
} from '@strapi/icons';
import { useTheme } from 'styled-components';


type State = {
  config: Config|null,
  data: FrontNav|null,
  name: string,
  locales: Locale[],
  navigations: NavInfo[],
  locale: string|null,
  newNavFormParams: NewNavParams|null,
  itemFormParams: ItemFormParams|null,
  error?: string,
};

type NewNavParams = {};

type ItemFormParams = {
  parent?: FrontNavItem,
  item?: FrontNavItem,
  errors: string[],
};

type NavInfo = api.NavInfo;

const initialState: State = {
  config: null,
  data: null,
  name: "Main",
  navigations: [],
  locales: [],
  locale: null,
  newNavFormParams: null,
  itemFormParams: null,
};

function HomePage() {

  const [state, setState] = useState<State>( initialState );
  const theme = useTheme();

  function loadNavigation(
    name?: string
  ) {
    console.debug( `loadNavigation: name: ${name}` );
    const nameSafe = name || (state.data && state.name) || "Main";
    let locale: string|undefined = state.locale || undefined;
    api.getConfig().then( config => {
    api.getLocales().then( locales => {
    api.get( locale ).then( navs => {
      const nav = navs.find(nav => (
        nav.name == nameSafe
      ));
      if( !nav ) {
        console.error( `nav not found: ${ name }, ${ locale }` );
        setState({ ...state,
          config: config,
          data: null,
          navigations: navs,
          name: nameSafe,
          locales: locales,
          locale: locale || null,
        });
      }
      else {
        setState({ ...state,
          config: config,
          data: nav,
          navigations: navs,
          name: nameSafe,
          locales: locales,
          locale: nav.locale,
        });
      }
      // console.debug( `new state: ${ JSON.stringify( state ) }` );
    })
    })
    }).catch( error => {
      setState(initialState);
    })
  }

  function loadLocale(
    locale: string
  ) {
    console.debug( `loadLocale: locale: ${locale}` );
    // const nameSafe = name || (state.data && state.name) || "Main";
    api.getConfig().then( config => {
    api.getLocales().then( locales => {
    api.get( locale ).then( navs => {
      const nav = navs.find(nav => (
        nav.name == state.name
      ));
      if( !nav ) {
        console.error( `nav not found: ${ name }, ${ locale }` );
        setState({ ...state,
          config: config,
          data: null,
          // navigations: navs,
          // name
          locales: locales,
          locale: locale,
        });
      }
      else {
        setState({ ...state,
          config: config,
          data: nav,
          navigations: navs,
          // name
          locales: locales,
          locale: locale,
        });
      }
      // console.debug( `new state: ${ JSON.stringify( state ) }` );
    })
    })
    }).catch( error => {
      setState(initialState);
    })
  }

  useEffect(() => {
    loadNavigation();
  }, []);

  if( state.error ) {
    return <p>{ `Errors: ${ state.error }` }</p>
  }
  if( !state.config || !state.locales) {
    return <LoadingIndicatorPage />
  };

  const handleSave = () => {
    if( !state.data ) {
      return;
    }
    api.update( state.data,  state.data?.locale ).then( navs => {
      const nav = navs.find(nav => (
        nav.name == state.data?.name
      ));
      setState({ ...state,
        data: nav || null,
        navigations: navs,
      });
    });
  };

  const handleOpenItemForm = (params: ItemFormParams ) => {
    setState( { ...state,
      itemFormParams: params,
    });
  };
  const handleItemFormAbort = () => {
    setState( { ...state,
      itemFormParams: null,
    });
  };

  const handleNewNavOpen = () => {
    setState( { ...state,
      newNavFormParams: {},
    });
  };
  const handleDelNav = () => {
    if( !state.data ) return;
    api.del( state.data.id ).then( () => {
    api.get( state.data?.locale ).then( () => {
      loadNavigation("Main");
    });
    });
  };

  const handleNewNavCommit = (params: string) => {
    api.addNavigation({
      locale: state.locale || undefined,
      name: params,
    }).then( navs => {
      state.name = params;
      const nav = navs.find(nav => (
        nav.name == state.name
        && nav.locale == state.locale
      ));
      state.newNavFormParams = null;
      setState({ ...state,
        data: nav || null,
        navigations: navs,
      });
    })
    .catch( error => {
      error: `Could not add navigation: ERROR: ${ error }`
    });
    // setState( { ...state,
    //   newNavFormParams: null,
    // });
  };
  const handleNewNavAbort = () => {
    setState( { ...state,
      newNavFormParams: null,
    });
  };


  const handleItemFormSubmit = (data: Omit<FrontNavItem,"id"> ) => {
    if( !state.data ) return;
    if( !state.itemFormParams ) return;

    // add:
    if( !state.itemFormParams?.item ) {
      const parent = state.itemFormParams?.parent;
      // console.debug( `setting: ${ JSON.stringify( data ) }` )
      const validationErrors = utils.validateAdd(
        state.data,
        data,
        state.config?.hierarchicalPaths || false,
        parent,
      );
      if( validationErrors.length > 0 ) {
        // console.error( validationErrors );
        state.itemFormParams.errors = validationErrors;
        setState({ ...state });
        return;
      }
      api.addItem( {...data }, state.data.id, parent, state.data?.locale ).then( navs => {
        const nav = navs.find(nav => (
          nav.name == state.data?.name
        ));
        setState({ ...state,
          data: nav || null,
          navigations: navs,
          itemFormParams: null,
        });
      });
    }
    // edit:
    else {
      const item = state.itemFormParams?.item;
      const newItem = { ...data, id: item.id };
      // console.debug( `setting: ${ JSON.stringify( newItem ) }` )
      const validationErrors = utils.validateEdit(
        state.data,
        newItem,
        state.config?.hierarchicalPaths || false,
      );
      if( validationErrors.length > 0 ) {
        // console.error( validationErrors );
        state.itemFormParams.errors = validationErrors;
        setState({ ...state });
        return;
      }
      api.updateItem( newItem,  state.data?.locale ).then( navs => {
        const nav = navs.find(nav => (
          nav.name == state.data?.name
        ));
        setState({ ...state,
          data: nav || null,
          navigations: navs,
          itemFormParams: null,
        });
      });
    }
  };

  const handleItemFormClearErrors = () => {
    if( ! state.itemFormParams ) return;
    state.itemFormParams.errors = [];
    setState( {
      ...state,
    } );
  }

  const handleAddLocalization = () => {
    api.addLocalization({
      name: state.data?.name,
      locale: state.locale || undefined
    }).then( navs => {
      const nav = navs.find(nav => (
        nav.name == state.name
      ));
      setState({ ...state,
        data: nav || null,
        navigations: navs,
      });
    })
    .catch( error => {
      error: `Could not add navigation: ERROR: ${ error }`
    });
  }

  const handleChangeNavigation = (name: string) => {
    loadNavigation(name);
  }

  const handleChangeLanguage = (locale: string) => {
    loadLocale(locale);
  }

  function onItemMoveUp (item: FrontNavItem) {
    if( !state.data ) { return; }
    utils.itemMoveUp( state.data, item );
    setState({ ...state });
  }
  function onItemMoveDown (item: FrontNavItem) {
    if( !state.data ) { return; }
    utils.itemMoveDown( state.data, item );
    setState({ ...state });
  }
  function onItemSetRemoved (item: FrontNavItem, removed: boolean) {
    utils.itemSetRemoved( item, removed );
    if( !state.data ) {
      return;
    }
    setState({ ...state });
  };
  return (
    <Main>
      { (state.newNavFormParams != null) &&
        <AddNavModal
          existing={ state.navigations }
          onCommit={ handleNewNavCommit }
          onAbort={ handleNewNavAbort }
        />
      }
      { state.data && state.itemFormParams &&
        <AddItemModal
          item={ state.itemFormParams?.item }
          relatedEntities={ state.data.relatedEntities }
          onCommit={ handleItemFormSubmit }
          onAbort={ handleItemFormAbort }
          onClearErrors={ handleItemFormClearErrors }
          formErrors={ state.itemFormParams.errors }
        />
      }
      <Header
        state={ state }
        handleNewNavOpen={ handleNewNavOpen }
        handleDelNav={ handleDelNav }
        handleChangeNavigation={ handleChangeNavigation }
        handleChangeLanguage={ handleChangeLanguage }
        handleSave={ handleSave }
      />
      {
        !state.data
        ? (<>
          <EmptyStateLayout
            content="No navigation for this locale yet..."
            action={
              <Button
                // fullWidth
                startIcon={<Plus />}
                onClick={ () => { handleAddLocalization(); } }
              >{
                "Add Navigation for this locale"
              }</Button>
            }
          />
        </>)
        : (
          <ContentLayout>
            { state.data.items.length == 0
            ? <EmptyStateLayout content="No content yet..." />
            : (
              <ItemList
                config={ state.config }
                items={ state.data.items }
                onSetRemoved={ onItemSetRemoved }
                onMoveUp={ onItemMoveUp }
                onMoveDown={ onItemMoveDown }
                onEditItemClicked={ (item) => { handleOpenItemForm({ item: item, errors: []}); } }
                onAddItemClicked={ (parent)=> { handleOpenItemForm({ parent: parent, errors: []}); } }
              />
            )
            }
            <Button
              fullWidth
              startIcon={<Plus />}
              label={ "label" }
              onClick={ () => { handleOpenItemForm({ errors: [] }); } }
              disabled={ !state.data || state.itemFormParams }
            >{
              "Add Item"
            }</Button>
          </ContentLayout>
        )
      }
    </Main>
  );
};

function Header(
  {
    state,
    handleNewNavOpen,
    handleDelNav,
    handleChangeNavigation,
    handleChangeLanguage,
    handleSave,
  }:
  {
    state: State,
    handleNewNavOpen: Function,
    handleDelNav: Function,
    handleChangeNavigation: Function,
    handleChangeLanguage: Function,
    handleSave: Function
  }
) {
  const theme = useTheme();
  return (
      <HeaderLayout
        title={ pluginId }
        subtitle="Edit Navigation"
        primaryAction={
          <Flex
            gap={ theme['spaces'][2] }
            alignItems="flex-end"
          >
            <Button
              label={ "label" }
              variant="danger"
              disabled={ !state.data || state.name == "Main" }
              onClick={ handleDelNav }
            >{ "Delete" }</Button>
            <Button
              fullWidth
              startIcon={<Plus />}
              label={ "label" }
              onClick={ handleNewNavOpen }
            >{
              "Add Navigation"
            }</Button>
            <SingleSelect
              label="Navigations"
              placeholder="Select Navigation..."
              onChange={ handleChangeNavigation }
              value={ state.name }
            >{
              state.navigations.map( (navInfo, i) => (
                <SingleSelectOption key={ i } value={ navInfo.name }>{ navInfo.name }</SingleSelectOption>
              ) )
            }</SingleSelect>
            <SingleSelect
              label="Locales"
              placeholder="Language..."
              onChange={ handleChangeLanguage }
              value={ state.locale }
            >{
              state.locales.map( (locale, i) => (
                <SingleSelectOption key={ i } value={ locale.code }>{ locale.name }</SingleSelectOption>
              ) )
            }</SingleSelect>
            <Button
              disabled={ !state.data || state.itemFormParams }
              startIcon={ <Check/> }
              onClick={ handleSave }
            >Save</Button>
          </Flex>
        }
      />
  );
}

export default HomePage;
