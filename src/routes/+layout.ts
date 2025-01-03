import { goto } from "$app/navigation";
import { PB } from "@/lib/stores/pocketbase.svelte";

export const ssr = false;

export const load = async ({ url }) => {
    const publicRoutes = ['/login', '/register']; // Erlaubte öffentliche Routen
    const isPublicRoute = publicRoutes.includes(url.pathname);   

    if (!isPublicRoute && !PB.instance.authStore.isValid) {
        // Clientseitige Weiterleitung
        goto('/login');
    }

    return;
};