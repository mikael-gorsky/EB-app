// src/components/reflect/MessageInput.tsx
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.s};
  margin: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.m} 
          ${({ theme }) => theme.spacing.s};
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  height: 100px; // Reduced height
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const ArrowIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px; // Slightly smaller
  margin-right: 8px;
  align-self: flex-start;
  padding-top: 2px;
`;

const InputArea = styled.textarea`
  flex: 1;
  border: none;
  resize: none;
  font-size: ${({ theme }) => theme.fontSizes.normal};
  outline: none;
  font-family: ${({ theme }) => theme.fonts.main};
  padding: 0;
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.light};
  }
`;

const AttachIcon = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px; // Slightly smaller
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AttachmentsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0 ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.m};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 3px 6px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const FileName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 20px);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  margin-left: 5px;
  cursor: pointer;
  font-size: 14px;
  min-width: 14px;
  padding: 0;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin: 0 ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s};
  padding: 0 5px;
`;

// Update ReflectionOutput height in src/components/reflect/ReflectionOutput.tsx
const OutputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => theme.colors.background.card};
  margin: ${({ theme }) => theme.spacing.m};
  min-height: 150px; // Reduced from 200px
  max-height: 45vh; // Added max height
  overflow-y: auto; // Allow scrolling if content is too long
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onAttach: (files: FileList) => void;
  attachments: File[];
  onAttachmentRemove: (index: number) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onAttach,
  attachments,
  onAttachmentRemove
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleAttachClick = () => {
    setFileError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Check if all files are PDFs
      const invalidFiles = Array.from(files).filter(file => 
        file.type !== 'application/pdf'
      );
      
      if (invalidFiles.length > 0) {
        setFileError('Only PDF files are allowed');
        // Reset input value
        event.target.value = '';
        return;
      }
      
      setFileError(null);
      onAttach(files);
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  return (
    <>
      <InputContainer>
        <InputWrapper>
          <ArrowIcon>≫</ArrowIcon>
          <InputArea 
            placeholder="Enter your message" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </InputWrapper>
        <AttachIcon onClick={handleAttachClick} title="Attach PDF file">📎</AttachIcon>
        <HiddenFileInput 
          type="file"
          accept=".pdf,application/pdf"
          ref={fileInputRef} 
          onChange={handleFileChange}
          multiple
        />
      </InputContainer>
      
      {fileError && <ErrorMessage>{fileError}</ErrorMessage>}
      
      {attachments.length > 0 && (
        <AttachmentsList>
          {attachments.map((file, index) => (
            <AttachmentItem key={index}>
              <FileName>{file.name}</FileName>
              <RemoveButton onClick={() => onAttachmentRemove(index)}>✕</RemoveButton>
            </AttachmentItem>
          ))}
        </AttachmentsList>
      )}
    </>
  );
};

export default MessageInput;