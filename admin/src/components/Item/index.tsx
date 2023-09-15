import { FrontNav, FrontNavItem } from '../../types'

import React, { FunctionComponent } from 'react';
import {
  Box,
  Card,
  CardBody,
  Typography,
  IconButton,
  Button,
  Flex,
  Badge,
  GridLayout,
} from '@strapi/design-system';

import { useTheme } from 'styled-components';
import {
  Pencil,
  Trash,
  Refresh,
  Plus,
  ArrowUp,
  ArrowDown,
} from '@strapi/icons';
// import styled, { CSSProperties } from 'styled-components'


type Args = {
  item: FrontNavItem,
  level: number,
  onSetRemoved: (item: FrontNavItem, removed: boolean) => void,
  onEditItemClicked: (item: FrontNavItem) => void,
  onAddItemClicked: (parent: FrontNavItem) => void,
  onMoveUp: (item: FrontNavItem) => void,
  onMoveDown: (item: FrontNavItem) => void,
}

const Item: FunctionComponent<Args> = (args) => {
  const { onSetRemoved, onEditItemClicked, onAddItemClicked, item, level} = args;
  const theme = useTheme();
  return (
    <Flex
      // marginTop={ theme['spaces'][2] }
      // marginBottom={ theme['spaces'][2] }
      direction="column"
      alignItems="stretch"
      gap={ theme['spaces'][2] }
    >
      <ItemCard {...args} />
      { /* SUBITEMS: */ }
      { item.subItems.length > 0 &&
        <Box
          paddingLeft={ theme['spaces'][8] }
        >
        { item.subItems.map( (subItem, i) => (
          <Item
            key={ i }
            { ...{
              ...args,
              level: level+1,
              item: subItem,
            } }
          />
        ) ) }
        </Box>
      }
    </Flex>
  );
}

const ItemCard: FunctionComponent<Args> = (args) => {
  const {
    item,
    level,
    onSetRemoved,
    onEditItemClicked,
    onAddItemClicked,
    onMoveUp,
    onMoveDown,
  } = args;
  const theme = useTheme();
  return (
    <Card
      background={ theme['colors']['neutral300'] }
      {
      ...( item.removed ? {
        style: { opacity: 0.5 }
      } : {}
        // ...{ style: { opacity: 0.5 } }
      )
      }
    >
      <CardBody
        direction="column"
        alignItems="stretch"
        gap={ theme['spaces'][2] }
        width="100%"
      >
        <Flex
          alignItems="center"
          width="100%"
          gap={ theme['spaces'][2] }
        >
          { /* CAPTIONS */ }
          <Flex
            flexGrow="0"
            alignItems="center"
            width="100%"
            wrap="wrap"
            gap={ theme['spaces'][2] }
          >
            <Box
              padding={ theme['spaces'][2] }
              grow={ 1 }
              width="150px"
              borderColor="neutral200"
              // background="neutral200"
            >
              <Typography
                elipsis
                fontWeight="bold"
                textColor={ theme['colors']['primary800'] }
              >{
                item.title
              }</Typography>
            </Box>
            <Box
              padding={ theme['spaces'][2] }
              grow={ 1 }
              width="150px"
              borderColor="neutral200"
              // background="neutral200"
            >
              <Typography
                elipsis
                fontWeight="bold"
                textColor={ theme['colors']['primary800'] }
              >{
                `/${item.path}`
              }</Typography>
            </Box>
            <Box
              grow={ 1 }
              padding={ theme['spaces'][2] }
              width="150px"
            >
            {
              item.related
              &&
              <Badge
                active={ item.related }
              >{
                `${ item.related?.displayName }`
              }</Badge>
            }
            </Box>
          </Flex>
          { /* EDIT BUTTONS */ }
          <Flex
            alignItems="center"
            gap={ theme['spaces'][2] }
          >
          <IconButton disabled={ item.removed } onClick={ () => { onMoveUp( item ); } } label={ "Move Up"} icon={ <ArrowUp/> } />
          <IconButton disabled={ item.removed } onClick={ () => { onMoveDown( item ); } } label={ "Move Down"} icon={ <ArrowDown/> } />
          <IconButton disabled={ item.removed } onClick={ () => { onEditItemClicked( item ); } } label={ "Edit"} icon={ <Pencil/> } />
          { !item.removed
              ? <IconButton onClick={ () => { onSetRemoved(item, true) } } label={ "Remove"} icon={ <Trash/> } />
              : <IconButton onClick={ () => { onSetRemoved(item, false) } } label={ "Restore"} icon={ <Refresh/> } />
          }
          </Flex>
        </Flex>
        <Button
          disabled={ item.removed }
          fullWidth
          startIcon={<Plus />}
          label={ "label" }
          onClick={ () => { onAddItemClicked( item ); } }
        >{
          "Add Child"
        }</Button>
      </CardBody>
    </Card>
  )
}

export default Item;
