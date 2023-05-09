import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from './locales';

const { setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: locale => import(`/locales/${locale}.js` /* @vite-ignore */),
});

setLocale(document.querySelector('html')?.lang || 'en');
setBasePath('src/assets');

export { default as SlTooltip } from '@shoelace-style/shoelace/dist/components/tooltip/tooltip';
export { default as SlBadge } from '@shoelace-style/shoelace/dist/components/badge/badge';
export { default as SlIcon } from '@shoelace-style/shoelace/dist/components/icon/icon';

export { default as HostAdminStatus } from './components/host-admin-status/host-admin-status';
export { default as HostInterfacesStatus } from './components/host-interfaces-status/host-interfaces-status';
/* plop:component */

/* plop:event */
