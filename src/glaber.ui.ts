import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from './locales';
import './assets/index.css';

const { setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: locale => import(`/locales/${locale}.js` /* @vite-ignore */),
});

setLocale(document.querySelector('html')?.lang || 'en');

export { SlTooltip, SlInput, SlSelect } from '@shoelace-style/shoelace';

export { default as HostAdminStatus } from './components/host-admin-status/host-admin-status';
export { default as HostInterfacesStatus } from './components/host-interfaces-status/host-interfaces-status';
export { default as Icon } from './components/icon/icon';
export { default as Badge } from './components/badge/badge';
/* plop:component */

export type { default as GlbLoadEvent } from './events/glb-load';
export type { default as GlbErrorEvent } from './events/glb-error';
/* plop:event */
