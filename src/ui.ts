import '@shoelace-style/shoelace/dist/components/badge/badge';
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

export { default as HostAdminStatus } from './components/host-admin-status/host-admin-status';
/* plop:component */

/* plop:event */
