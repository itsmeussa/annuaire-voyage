import type { Metadata } from "next";
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Travel Agencies World',
        short_name: 'Travel Agencies',
        description: 'Discover and connect with verified travel agencies worldwide. Find the perfect agency for your next adventure.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#667eea',
        icons: [
            {
                src: '/travellogos/144x144.png',
                sizes: '144x144',
                type: 'image/png',
            },
            {
                src: '/travellogos/square-blue-white-background.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
