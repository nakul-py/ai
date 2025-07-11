/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */

import { InputToolbarRegistry, TooltippedButton } from '@jupyter/chat';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React from 'react';
import { showFileBrowserModal } from '../utils/show-file-browser';

/**
 * Properties of the attach button.
 */
export interface IAttachButtonProps
  extends InputToolbarRegistry.IToolbarItemProps {}

/**
 The attach button.
 */
export function AttachButton(
  props: InputToolbarRegistry.IToolbarItemProps
): JSX.Element {
  const tooltip = 'Attach a file';

  const handleClick = async () => {
    const inputModel = props.model;
    if (!inputModel) {
      console.warn('No input model found.');
      return;
    }

    try {
      await showFileBrowserModal(inputModel);
    } catch (e) {
      console.error('Error opening file modal:', e);
    }
  };

  return (
    <TooltippedButton
      onClick={handleClick}
      tooltip={tooltip}
      buttonProps={{
        size: 'small',
        variant: 'contained',
        title: tooltip
      }}
    >
      <AttachFileIcon />
    </TooltippedButton>
  );
}

/**
 * Factory returning the toolbar item.
 * This function creates an attach button that allows users to attach files.
 *
 * @returns An InputToolbarRegistry.IToolbarItem for the attach button.
 */

export function attachItem(): InputToolbarRegistry.IToolbarItem {
  return {
    element: (props: InputToolbarRegistry.IToolbarItemProps) => {
      return <AttachButton {...props} />;
    },
    position: 40,
    hidden: false
  };
}
