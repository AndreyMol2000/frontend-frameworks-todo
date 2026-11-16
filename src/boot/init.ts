import { defineBoot } from '#q-app';
import { installErrorHandlers } from '../main';
import { useUiStore } from '../stores/uiStore';
export default defineBoot(({ app }) => { installErrorHandlers(app); const ui = useUiStore(); ui.setDark(ui.isDark); });
