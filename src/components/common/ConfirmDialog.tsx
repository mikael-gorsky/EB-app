// src/components/common/ConfirmDialog.tsx
import React from 'react';
import styled from 'styled-components';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Message = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button<{ isPrimary?: boolean }>`
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background-color: ${props => props.isPrimary ? '#38a3a5' : '#f1f1f1'};
  color: ${props => props.isPrimary ? 'white' : 'black'};
  
  &:hover {
    background-color: ${props => props.isPrimary ? '#2c8385' : '#e1e1e1'};
  }
`;

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <OverlayContainer>
      <DialogContainer>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button onClick={onCancel}>Cancel</Button>
          <Button isPrimary onClick={onConfirm}>Confirm</Button>
        </ButtonContainer>
      </DialogContainer>
    </OverlayContainer>
  );
};

export default ConfirmDialog;