
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type List = {
  id: string;
  name: string;
  description?: string;
  matches: string[];
  createdAt: string;
};

export const useLists = () => {
  const [lists, setLists] = useLocalStorage<List[]>('footballtrackr-lists', []);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);

  const createList = (name: string, description?: string, initialMatches: string[] = []): List => {
    const newList: List = {
      id: crypto.randomUUID(),
      name,
      description,
      matches: activeMatchId ? [...new Set([...initialMatches, activeMatchId])] : initialMatches,
      createdAt: new Date().toISOString()
    };
    
    setLists((prevLists) => [...prevLists, newList]);
    return newList;
  };

  const addMatchToList = (listId: string, matchId: string): void => {
    setLists((prevLists) => 
      prevLists.map((list) => {
        if (list.id === listId && !list.matches.includes(matchId)) {
          return { ...list, matches: [...list.matches, matchId] };
        }
        return list;
      })
    );
  };

  const removeMatchFromList = (listId: string, matchId: string): void => {
    setLists((prevLists) => 
      prevLists.map((list) => {
        if (list.id === listId) {
          return { ...list, matches: list.matches.filter(id => id !== matchId) };
        }
        return list;
      })
    );
  };

  const deleteList = (listId: string): void => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
  };

  const openListModal = (matchId: string): void => {
    setActiveMatchId(matchId);
    setIsListModalOpen(true);
  };

  const closeListModal = (): void => {
    setIsListModalOpen(false);
    setActiveMatchId(null);
  };

  const openCreateListModal = (matchId?: string): void => {
    if (matchId) setActiveMatchId(matchId);
    setIsCreateListModalOpen(true);
  };

  const closeCreateListModal = (): void => {
    setIsCreateListModalOpen(false);
    if (!isListModalOpen) setActiveMatchId(null);
  };

  const isMatchInList = (listId: string, matchId: string): boolean => {
    const list = lists.find(list => list.id === listId);
    return list ? list.matches.includes(matchId) : false;
  };

  return {
    lists,
    createList,
    addMatchToList,
    removeMatchFromList,
    deleteList,
    isMatchInList,
    isListModalOpen,
    openListModal,
    closeListModal,
    isCreateListModalOpen,
    openCreateListModal,
    closeCreateListModal,
    activeMatchId
  };
};
