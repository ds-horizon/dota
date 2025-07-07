import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Textarea,
  ActionIcon,
  Group,
  ScrollArea,
  Text,
  Avatar,
  Loader,
} from '@mantine/core';
import {
  IconSend,
  IconRobot,
  IconUser,
  IconRefresh,
  IconMinimize,
  IconX,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import styles from './index.module.css';
import { useRef as useCounterRef } from 'react';

interface Message {
  id: number;
  type: 'user' | 'assistant' | 'system';
  content: string;
  loading?: boolean;
}

interface ChatbotProps {
  authToken: string;
  tenant?: string;
  onClose?: () => void;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

export function Chatbot({
  authToken,
  tenant,
  onClose,
  minimized = false,
  onToggleMinimize,
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'system', content: 'Hello! How can I help you today?' },
  ]);

  // Simple incremental id to avoid Date.now() collision when two messages are added in same millisecond
  const messageIdRef = useCounterRef(2); // starts at 2 because 1 used for initial system

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const addMessage = (msg: Omit<Message, 'id'>): number => {
    const newId = messageIdRef.current++;
    setMessages((prev) => [...prev, { ...msg, id: newId }]);
    return newId;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    addMessage({ type: 'user', content: inputValue.trim() });
    setInputValue('');
    // Add a placeholder assistant message so UI shows loader
    const loadingId = addMessage({ type: 'assistant', content: '', loading: true });
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/chatbot', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          context: { tenant },
          history: messages.filter((m) => m.type !== 'system' && !m.loading).slice(-5).map((m) => ({
            type: m.type,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

      const data = await response.json();

      // Replace loading bubble with actual content
      setMessages((prev) => prev.map((msg) =>
        msg.id === loadingId ? { ...msg, loading: false, content: data.response || 'Sorry, no response' } : msg
      ));
    } catch (err: any) {
      console.error('Chatbot error:', err);
      notifications.show({ 
        title: 'Chatbot error', 
        message: err.message || 'Failed to get response', 
        color: 'red',
        position: 'top-center',
        withCloseButton: true,
        styles: { root: { zIndex: 3000 } },
      });
      setMessages((prev) => prev.map((msg) =>
        msg.id === loadingId ? { ...msg, loading: false, content: 'Sorry, something went wrong.' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Minimized header
  if (minimized) {
    return (
      <Paper
        className={`${styles.root} ${styles.minimized}`}
        onClick={onToggleMinimize}
        withBorder
      >
        <IconRobot size={20} />
      </Paper>
    );
  }

  return (
    <Paper className={styles.root}>
      {/* Header */}
      <Group className={styles.header} justify="space-between" align="center">
        <Group align="center" gap="xs">
          <Avatar size="sm" color="blue" radius="xl">
            <IconRobot size={16} />
          </Avatar>
          <div>
            <Text fw={600}>Assistant</Text>
            <Text size="xs" color="dimmed">
              {tenant || 'Ready to chat'}
            </Text>
          </div>
        </Group>
        <Group gap="xs" className={styles.controls}>
          <ActionIcon size="sm" onClick={() => setMessages([{ id: Date.now(), type: 'system', content: 'Chat cleared. How can I help?' }])}>
            <IconRefresh size={16} />
          </ActionIcon>
          <ActionIcon size="sm" onClick={onToggleMinimize}>
            <IconMinimize size={16} />
          </ActionIcon>
          {onClose && (
            <ActionIcon size="sm" color="red" onClick={onClose}>
              <IconX size={16} />
            </ActionIcon>
          )}
        </Group>
      </Group>

      {/* Messages */}
      <ScrollArea className={styles.messages} viewportRef={scrollRef}>
        {messages.map((m) => (
          <Group key={m.id} wrap="nowrap" className={`${styles.bubble} ${styles[m.type]}`}>
            {m.type === 'assistant' && (
              <Avatar size="xs" color="gray" radius="xl">
                {m.loading ? <Loader size="xs" /> : <IconRobot size={12} />}
              </Avatar>
            )}
            <Text>{m.loading ? 'Thinking...' : m.content}</Text>
            {m.type === 'user' && (
              <Avatar size="xs" color="blue" radius="xl">
                <IconUser size={12} />
              </Avatar>
            )}
          </Group>
        ))}
      </ScrollArea>

      {/* Cute floating bot in the background */}
      <IconRobot size={100} className={styles.botFloat} stroke={1} />

      {/* Input */}
      <Group className={styles.footer} wrap="nowrap" align="center">
        <Textarea
          className={styles.input}
          placeholder="Type your message…"
          autosize
          minRows={1}
          maxRows={4}
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={isLoading}
        />
        <ActionIcon
          size="lg"
          className={styles.send}
          onClick={sendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          {isLoading ? <Loader size="xs" /> : <IconSend size={20} />}
        </ActionIcon>
      </Group>
    </Paper>
  );
}

export default Chatbot;
