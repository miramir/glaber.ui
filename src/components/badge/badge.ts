import { html, LitElement } from 'lit';
import type { CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './badge.styles';

/**
 * Badges are used to draw attention and display statuses or counts.
 *
 * @documentation none
 * @tag glb-badge
 * @status stable
 * @since 0.0.1
 *
 * @slot - The badge's content.
 *
 * @csspart base - The component's base wrapper.
 */
@customElement('glb-badge')
export default class Badge extends LitElement {
  static styles: CSSResultGroup = styles;

  /** The badge's theme variant. */
  @property({ reflect: true }) variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' = 'primary';

  /** Draws a pill-style badge with rounded edges. */
  @property({ type: Boolean, reflect: true }) pill = false;

  /** Makes the badge pulsate to draw attention. */
  @property({ type: Boolean, reflect: true }) pulse = false;

  render() {
    const classes = classMap({
      badge: true,
      'badge--primary': this.variant === 'primary',
      'badge--success': this.variant === 'success',
      'badge--neutral': this.variant === 'neutral',
      'badge--warning': this.variant === 'warning',
      'badge--danger': this.variant === 'danger',
      'badge--pill': this.pill,
      'badge--pulse': this.pulse,
    });

    return html`<slot part="base" class=${classes} role="status"></slot>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'glb-badge': Badge;
  }
}
