import { ChatStorageHook, Message } from '@/lib/validation';
import { useState, useEffect } from 'react';


const useChatStorage = (initialMessages: Message[] = []): ChatStorageHook => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [syncToCloud, setSyncToCloud] = useState<boolean>(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (syncToCloud) {
      // Implement cloud sync logic here
      console.log('Syncing to cloud...');
    }
  }, [syncToCloud, messages]);

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const toggleCloudSync = () => {
    setSyncToCloud((prev) => !prev);
  };

  return {
    messages,
    addMessage,
    clearMessages,
    syncToCloud,
    toggleCloudSync,
  };
};

export default useChatStorage;