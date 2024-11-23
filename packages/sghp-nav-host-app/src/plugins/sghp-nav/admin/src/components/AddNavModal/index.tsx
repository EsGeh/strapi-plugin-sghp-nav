import {
  FrontNav,
  FrontNavItem,
  Related,
} from '../../types'
import * as api from '../../api';

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


type NavInfo = api.NavInfo;

type State = {
  formData: FormData,
  errors: Errors,
};

const noErrors: Readonly<Errors> = {
  name: null,
}

type FormData = {
  name: string
};

type Errors = Record<keyof FormData, string|null>;

export default function AddNavModal({
  existing,
  onAbort,
  onCommit,
}
  : {
    existing: NavInfo[],
    onAbort: () => void,
    onCommit: (string) => void,
  }
)
{
  // console.log( "AddItemModal():" ); console.log( JSON.stringify( args ) );
  const theme = useTheme();

  const validators: Record<keyof FormData, (string) => string|undefined> = {
    name: (val: string) => {
      if( existing.find( x => (x.name == val) ) )
        return "Name already used";
    },
  }

  const [state, setState] = useState<State>( {
    formData: { name: "" },
    errors: { name: null },
  } );

  function onInputChange( field: keyof Errors, val: string) {
    console.log( `onInputChange: ${ field } = ${ val }` );
    state.errors.name = "";
    state.formData[field] = val;
    state.errors[field] = null;
    const error = validators[field]( val );
    if( error ) state.errors[field] = error;
    setState( { ...state } );
  };

  return (
    <ModalLayout
      onClose={ onAbort }
      labelledBy="title"
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">Title</Typography>
      </ModalHeader>
      <form
        onSubmit={ (e) => e.preventDefault() }
      >
        <ModalBody>
          <Field
            name="title"
            required={true}
            hint="Navigation Menu"
            error={ state.errors.name }
          >
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <FieldLabel>Title</FieldLabel>
              <FieldInput
                type="text"
                placeholder="e.g. Footermenu"
                value={ state.formData.name }
                onChange={ e => { onInputChange( "name", e.target.value ); } }
              />
              <FieldHint/>
              <FieldError/>
            </Flex>
          </Field>
        </ModalBody>
        <ModalFooter
          startActions={
            <Button
              onClick={ onAbort }
              variant="tertiary"
            >Cancel</Button>
          }
          endActions={
            <Button
              onClick={ ()=>(onCommit(state.formData.name)) }
              disabled={ JSON.stringify( state.errors ) !== JSON.stringify( noErrors ) }
            >Submit</Button>
          }
        />
      </form>
    </ModalLayout>
  );
}
