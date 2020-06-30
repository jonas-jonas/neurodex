import React from 'react';
import { Modal } from '../utility/Modal';

type CollaborationModalProps = {};

const CollaborationModal: React.FC<CollaborationModalProps> = () => {
  return (
    <>
      <Modal.Title title="Kollaboration" closeTooltip="Kollaboration schließen" />
    </>
  );
};

export default CollaborationModal;
