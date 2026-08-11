export const pushToDataLayer = (eventName: string, payload: Record<string, any> = {}) => {
    // Ensure window.dataLayer exists (initialized by GTM snippet)
    window.dataLayer = window.dataLayer || [];
    
    window.dataLayer.push({
        event: eventName,
        ...payload,
    });
    
    // For local debugging
    if (import.meta.env.DEV) {
        console.log(`[GTM] Event Pushed: ${eventName}`, payload);
    }
};

// Types for window.dataLayer
declare global {
    interface Window {
        dataLayer: any[];
    }
}
