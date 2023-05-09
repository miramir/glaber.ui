type GlbLoadEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'glb-load': GlbLoadEvent;
  }
}

export default GlbLoadEvent;
