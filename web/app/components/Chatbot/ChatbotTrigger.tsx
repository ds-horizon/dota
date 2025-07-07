import React, { useState } from 'react';
import { ActionIcon, Portal } from '@mantine/core';
import { IconMessageCircle } from '@tabler/icons-react';
import { Chatbot } from './index';
import { User } from '~/.server/services/Auth/Auth.interface';
import classes from './ChatbotTrigger.module.css';

interface ChatbotTriggerProps {
  user: User;
  tenant?: string;
}

export function ChatbotTrigger({ user, tenant }: ChatbotTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <ActionIcon
          className={classes.triggerButton}
          size="xl"
          radius="xl"
          variant="filled"
          color="blue"
          onClick={handleToggle}
          title="Open Dota Assistant"
        >
          <IconMessageCircle size={28} />
        </ActionIcon>
      )}

      {/* Chatbot portal */}
      <Portal>
        {isOpen && (
          <Chatbot
            authToken="mock-google-token" // Using mock token for now
            tenant={tenant}
            onClose={handleClose}
            minimized={isMinimized}
            onToggleMinimize={handleToggleMinimize}
          />
        )}
      </Portal>
    </>
  );
}

export default ChatbotTrigger; 