"use client";

import { useEffect } from "react";
import { useChatBot } from "./ChatBotContext";

interface AgencyChatContextSetterProps {
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

export default function AgencyChatContextSetter(props: AgencyChatContextSetterProps) {
    const { setContext } = useChatBot();

    useEffect(() => {
        setContext({
            agencyName: props.agencyName,
            location: props.location,
            services: props.services,
            experiences: props.experiences,
            contact: props.contact,
        });

        // Cleanup context when leaving the page
        return () => setContext(null);
    }, [props.agencyName, props.location, props.services, props.experiences, props.contact, setContext]);

    return null;
}
