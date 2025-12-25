"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface AgencyContext {
    agencyName: string;
    location: string;
    services?: string[];
    experiences?: Array<{
        title: string;
        description?: string;
        location?: string;
        price?: number;
        currency?: string;
    }>;
    contact?: {
        phone?: string;
        website?: string;
    };
}

interface ChatBotContextType {
    context: AgencyContext | null;
    setContext: (context: AgencyContext | null) => void;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export function ChatBotProvider({ children }: { children: ReactNode }) {
    const [context, setContext] = useState<AgencyContext | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "👋 Hello! I'm TravelBot. Feel free to ask me anything about the agencies you browse.",
        },
    ]);

    return (
        <ChatBotContext.Provider value={{ context, setContext, messages, setMessages }}>
            {children}
        </ChatBotContext.Provider>
    );
}

export function useChatBot() {
    const context = useContext(ChatBotContext);
    if (context === undefined) {
        throw new Error("useChatBot must be used within a ChatBotProvider");
    }
    return context;
}
