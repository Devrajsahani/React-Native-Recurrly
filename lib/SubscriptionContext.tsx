import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HOME_SUBSCRIPTIONS } from '@/constants/data';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (id: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions((prev) => [subscription, ...prev]);
  };

  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription, removeSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};
