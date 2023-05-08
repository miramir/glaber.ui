import { describe, expect, it } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import type HostInterfacesStatus from './host-interfaces-status';
import './host-interfaces-status';

describe('<glb-host-interfaces-status>', () => {
  it('should render a component', async () => {
    const el = await fixture<HostInterfacesStatus>(html`<glb-host-interfaces-status></glb-host-interfaces-status>`);
    expect(el.shadowRoot).toBeTruthy();
  });
});
