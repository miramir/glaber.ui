import { html, LitElement } from 'lit';
import type { CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { msg, localized } from '@lit/localize';
import styles from './host-interfaces-status.styles';

/**
 * Short summary of the component's intended use.
 *
 * @documentation https://gmiramir.gitlab.io/glb-ui-components/components/host-interfaces-status
 * @tag glb-host-interfaces-status
 * @status experimental
 * @since 0.0.1
 *
 * @dependency glb-example
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
@customElement('glb-host-interfaces-status')
@localized()
export default class HostInterfacesStatus extends LitElement {
  static styles: CSSResultGroup = styles;

  /** An example attribute. */
  @property({ type: String }) str: string = '';

  override render() {
    return html`<slot>${msg('tes')}</slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'glb-host-interfaces-status': HostInterfacesStatus;
  }
}
