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
  locales: Locale[],
  locale: string|null,
  itemFormParams: ItemFormParams|null,
  error?: string,
};

type ItemFormParams = {
  parent?: FrontNavItem,
  item?: FrontNavItem,
  errors: string[],
}

const initialState: State = {
  config: null,
  data: null,
  locales: [],
  locale: null,
  itemFormParams: null,
};

function HomePage() {

  const [state, setState] = useState<State>( initialState );
  const theme = useTheme();

  function loadData( locale?: string ) {
    api.getConfig().then( config => {
    api.getLocales().then( locales => {
    api.get( locale ).then( nav => {
      setState({ ...state,
        config: config,
        data: nav,
        locales: locales,
        locale: nav.locale,
      });
    }).catch( error => {
      if( error.response.status >= 400 && error.response.status < 500 ) {
        console.log( `not existing ${ error.response.status }` );
        setState({ ...state,
          config: config,
          data: null,
          locales: locales,
          locale: locale || null,
        });
      }
      else {
        setState({ ...state,
          config: config,
          data: null,
          locales: locales,
          locale: locale || null,
          error: `Could not load navigation: ERROR: ${ error }`
        });
      }
    })
    })
    });
  }

  useEffect(() => {
    loadData();
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
    api.update( state.data,  state.data?.locale ).then( newData => {
      setState({ ...state,
        data: newData,
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
      api.addItem( data, parent, state.data?.locale ).then( newData => {
        setState({ ...state,
          data: newData,
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
      api.updateItem( newItem,  state.data?.locale ).then( newData => {
        setState({ ...state,
          data: newData,
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

  const handleAddNavigation = () => {
    api.addNavigation( state.locale || undefined ).then( newData => {
      setState({ ...state,
        data: newData,
      });
    })
    .catch( error => {
      error: `Could not add navigation: ERROR: ${ error }`
    });
  }

  const handleChangeLanguage = (locale: string) => {
    // console.debug( `handleChangeLanguage: ${ locale }` );
    loadData( locale );
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
                onClick={ () => { handleAddNavigation(); } }
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
    handleChangeLanguage,
    handleSave,
  }:
  {
    state: State,
    handleChangeLanguage: any,
    handleSave: any
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
          >
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
