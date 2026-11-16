import { afterEach, beforeEach, vi } from 'vitest';
import { config } from '@vue/test-utils';
import { Quasar, QForm, QInput, QBtn, QItem, QItemSection, QItemLabel, QCheckbox, QList, QTooltip, QBanner, Notify, Dialog } from 'quasar';
config.global.plugins = [[Quasar, { components: { QForm, QInput, QBtn, QItem, QItemSection, QItemLabel, QCheckbox, QList, QTooltip, QBanner }, plugins: { Notify, Dialog } }]];
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
afterEach(() => { vi.restoreAllMocks(); });
Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn().mockImplementation((query: string) => ({ matches: false, media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() })) });
