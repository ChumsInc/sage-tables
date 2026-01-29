import {useEffect, useState} from "react";


export function useTheme() {
    const htmlElement = document.documentElement;
    if (!htmlElement) {
        return;
    }
    const [theme, setTheme] = useState<string>(htmlElement.dataset['bsTheme'] ?? 'light');
    const observerCallback = (entries: MutationRecord[]) => {
        for (const mutation of entries) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
                setTheme(htmlElement.dataset['bsTheme'] ?? 'light');
            }
        }
    }
    const observer = new MutationObserver(observerCallback);
    useEffect(() => {
        observer.observe(htmlElement, {attributes: true, attributeFilter: ['data-bs-theme']});
        return () => {
            observer.disconnect();
        }
    }, []);
    return theme;
}
