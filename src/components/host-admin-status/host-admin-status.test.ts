import { test, describe, expect, expectTypeOf } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import type { SlBadge } from '@shoelace-style/shoelace';
import type HostAdminStatus from './host-admin-status';
import './host-admin-status';
import '@shoelace-style/shoelace/dist/components/badge/badge';

describe('<glb-host-admin-status>', async () => {
  test.each([
    [0, 0, 'hoststatus.enabled', 'success'],
    [0, 1, 'hoststatus.maintenance', 'warning'],
    [1, 0, 'hoststatus.disabled', 'danger'],
    [1, 1, 'hoststatus.disabled', 'danger'],
    [2, 0, 'hoststatus.unknown', 'neutral'],
  ])(
    'States (status %i, maintenance %i) -> text %s, class %s',
    async (status, maintenance, expectedText, expectedVariant) => {
      const el = await fixture<HostAdminStatus>(
        html`<glb-host-admin-status status=${status} maintenance=${maintenance}></glb-host-admin-status>`,
      );

      expect(el).toBeTruthy();

      const child = el.renderRoot.querySelector<SlBadge>('sl-badge')!;
      expectTypeOf(child).toEqualTypeOf<SlBadge>();
      expect(child.textContent).toBe(expectedText);
      console.log(child.getAttribute('variant'));
      expect(child.variant).toBe(expectedVariant);
    },
  );
});
