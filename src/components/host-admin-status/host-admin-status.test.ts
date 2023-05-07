import { test, describe, expect, expectTypeOf, it } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import type { SlBadge } from '@shoelace-style/shoelace';
import type HostAdminStatus from './host-admin-status';
import './host-admin-status';

describe('<glb-host-admin-status>', async () => {
  it('when provided no parameters', async () => {
    const el = await fixture<HostAdminStatus>(
      html`<glb-host-admin-status></glb-host-admin-status>`,
    );

    expect(el).toBeTruthy();

    const child = el.renderRoot.querySelector<SlBadge>('sl-badge')!;
    expectTypeOf(child).toEqualTypeOf<SlBadge>();
    expect(child.textContent).toBe('Enabled');
    expect(child.variant).toBe('success');
  });

  test.each([
    [0, 0, 'Enabled', 'success'],
    [0, 1, 'In maintenance', 'warning'],
    [1, 0, 'Disabled', 'danger'],
    [1, 1, 'Disabled', 'danger'],
    [2, 0, 'Unknown', 'neutral'],
  ])(
    'States (status %i, maintenance %i) -> text %s, class %s',
    async (status, maintenance, expectedText, expectedVariant) => {
      const el = await fixture<HostAdminStatus>(
        html`<glb-host-admin-status status=${status} maintenance=${maintenance}></glb-host-admin-status>`,
      );

      const child = el.renderRoot.querySelector<SlBadge>('sl-badge')!;
      expect(child.textContent).toBe(expectedText);
      expect(child.variant).toBe(expectedVariant);
    },
  );
});
