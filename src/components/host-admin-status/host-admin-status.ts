import { LitElement, html } from 'lit';
import type { CSSResultGroup } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { msg, localized } from '@lit/localize';
import styles from './host-admin-status.styles';

const HOST_STATUS_MONITORED: Number = 0;
const HOST_STATUS_NOT_MONITORED: Number = 1;
const HOST_MAINTENANCE_STATUS_ON: Number = 1;

/**
 * HostAdminStatus
 * @summary Used for show administrative status for host
 * @tag glb-host-admin-status
 * @status stable
 * @since 0.0.1
 */
@customElement('glb-host-admin-status')
@localized()
export default class HostAdminStatus extends LitElement {
  static styles: CSSResultGroup = styles;

  /** Monitoring status */
  @property({ type: Number }) status: number = 0;

  /** Maintenance status */
  @property({ type: Number }) maintenance: number = 0;

  override render() {
    const attrs = this.presentAttr(this.status, this.maintenance);

    return html`<sl-badge variant="${attrs.variant}">${attrs.text}</sl-badge>`;
  }

  private presentAttr(status:number, maintenance: number): {variant: string, text: string} {
    switch (status) {
      case HOST_STATUS_MONITORED:
        return maintenance === HOST_MAINTENANCE_STATUS_ON
          ? { variant: 'warning', text: msg('In maintenance') }
          : { variant: 'success', text: msg('Enabled') };
      case HOST_STATUS_NOT_MONITORED:
        return { variant: 'danger', text: msg('Disabled') };
      default:
        return { variant: 'neutral', text: msg('Unknown') };
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'glb-host-admin-status': HostAdminStatus;
  }
}
