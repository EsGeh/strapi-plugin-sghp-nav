import { FrontNav, FrontNavItem } from '../../types'
import Item from '../Item';

import React, { FunctionComponent } from 'react';
import {
  Box,
  Flex,
} from '@strapi/design-system';
import {
  useTheme,
} from 'styled-components';


type Args = {
  items: FrontNavItem[],
  onSetRemoved: (item: FrontNavItem, removed: boolean) => void,
  onEditItemClicked: (item: FrontNavItem) => void,
  onAddItemClicked: (parent?: FrontNavItem) => void,
  onMoveUp: (item: FrontNavItem) => void,
  onMoveDown: (item: FrontNavItem) => void,
}

const ItemList: FunctionComponent<Args> = (args) => {
  const { items, onSetRemoved, onAddItemClicked, onEditItemClicked } = args;
  const theme = useTheme();
  return (
    <Flex
      background={ theme['colors']['neutral150'] }
      padding={ theme['spaces'][2] }
      gap={ theme['spaces'][2] }
      direction="column"
      alignItems="stretch"

    >{
      items.map( (item, i) => {
        return <Item
          key={ i }
          level={ 0 }
          item={ item }
          onSetRemoved={ onSetRemoved }
          onEditItemClicked={ onEditItemClicked }
          onAddItemClicked={ onAddItemClicked }
          onMoveUp={ args.onMoveUp }
          onMoveDown={ args.onMoveDown }
        />
      } )
    }</Flex>
  );
}

export default ItemList;
