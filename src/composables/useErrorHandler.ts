import { useUiStore } from '../stores/uiStore';
export function useErrorHandler() { const ui = useUiStore(); return { handleError: ui.handleError }; }
