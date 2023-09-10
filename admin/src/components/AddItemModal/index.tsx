import {
  FrontNav,
  FrontNavItem,
  Related,
} from '../../types'

import React, { FunctionComponent, useState, useRef } from 'react';
import {
  Typography,
  IconButton,
  Button,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Field,
  FieldLabel,
  FieldInput,
  FieldHint,
  FieldError,
  SingleSelect, SingleSelectOption,
  Flex,
  Alert,
} from '@strapi/design-system';

import { useTheme } from 'styled-components';
import {
  Trash,
  Refresh
} from '@strapi/icons';
import slugify from '@sindresorhus/slugify';


type Args = {
  relatedEntities: FrontNav['relatedEntities'],
  item?: FrontNavItem,
  onCommit: (data: Omit<FrontNavItem,"id">) => void,
  onAbort: () => void,
  onClearErrors: () => void,
  formErrors: string[],
}

type State = {
  formData: FormData,
  errors: Errors,
}

type Errors = Record<Exclude<keyof FormData,"related">, string|null>;

const noErrors: Readonly<Errors> = {
  title: null, path: null
}

interface FormData {
  title: string,
  path: string,
  related: Related|null,
}

const emptyFormData: FormData = {
  title: "",
  path: "",
  related: null,
}

const validators = {
  title: val => {
    if( val == "" )
      return "Title cannot be empty";
  },
  path: val => {
    if(
      val.startsWith( "/" )
      || val.endsWith( "/" )
    )
      return "Path cannot start or end with '/'";
  },
}


const AddItemModal: FunctionComponent<Args> = (args) => {
  // console.log( "AddItemModal():" ); console.log( JSON.stringify( args ) );
  const { item, onAbort, onCommit } = args;
  const theme = useTheme();
  let initFormData = {... emptyFormData };
  if( item ) {
    initFormData = { ...item };
  }
  let initErrors = {... noErrors };
  for( const field of Object.keys( noErrors ) ) {
    initErrors[field] = validators[field]( initFormData[field] ) ?? null;
  }
  const [state, setState] = useState<State>( {
    formData: initFormData,
    errors: {...initErrors},
  } );
  const handleCommit = (event) => {
    event.preventDefault();
    if( JSON.stringify( state.errors ) === JSON.stringify( noErrors ) ) {
      onCommit(
        {
          ...state.formData,
          subItems: [],
          removed: false,
        },
      );
    }
  }

  function onTitleChange( val: string ) {
    state.formData.path = slugify( val );
  }

  function onInputChange( field: keyof Errors, val: string) {
    args.onClearErrors();
    state.formData[field] = val;
    state.errors[field] = null;
    const error = validators[field]( val );
    if( error ) state.errors[field] = error;
    if( field === "title" ) {
      onTitleChange( val );
    }
    setState( { ...state } );
  };

  return (
    <ModalLayout onClose={ onAbort } labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">Title</Typography>
      </ModalHeader>
      <form
        onSubmit={ (e) => e.preventDefault() }
      >
        <ModalBody>
          { (args.formErrors.length > 0) &&
          <Alert title="Errors" variant="danger">{
            args.formErrors.join(", ")
          }</Alert>
          }
          <Field
            name="title"
            required={false}
            hint="Item Caption"
            error={ state.errors.title }
          >
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <FieldLabel>Title</FieldLabel>
              <FieldInput
                type="text"
                placeholder="e.g. Home"
                value={ state.formData.title }
                onChange={ e => { onInputChange( "title", e.target.value ); } }
              />
              <FieldHint/>
              <FieldError/>
            </Flex>
          </Field>

          <Field
            name="path"
            required={false}
            hint="The link where this entry points to, e.g. 'home' will link to /home"
            error={ state.errors.path }
          >
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <FieldLabel>Path</FieldLabel>
              <FieldInput
                type="text"
                placeholder="e.g. home"
                value={ state.formData.path }
                onChange={ e => { onInputChange( "path", e.target.value ); } }
              />
              <FieldHint/>
              <FieldError/>
            </Flex>
          </Field>

          <SingleSelect
            placeholder={ `related object` }
            label={ `Related object` }
            value={ state.formData.related?.id }
            onChange={ e => {
              state.formData.related = args.relatedEntities.find( x => x.id == e ) ?? null;
              setState( {...state} );
            } }
          >
            {
            args.relatedEntities.map( (relatedEntity, i) => (
              <SingleSelectOption key={ i } value={ relatedEntity.id }>{ relatedEntity.displayName }</SingleSelectOption>
            ) )
          }</SingleSelect>
        </ModalBody>
        <ModalFooter
          startActions={
            <Button onClick={ onAbort } variant="tertiary">Cancel</Button>
          }
          endActions={
            <Button
              onClick={ handleCommit }
              disabled={ JSON.stringify( state.errors ) !== JSON.stringify( noErrors ) }
            >Submit</Button>
          }
        />
      </form>
    </ModalLayout>
  );
}

export default AddItemModal;
