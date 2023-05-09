import defaultLibrary from './library.default';
import systemLibrary from './library.system';
import type Icon from './icon';

export type IconsMap = { [key: string]: string; };
export type IconLibraryResolver = (name: string) => string;
export type IconLibraryMutator = (svg: SVGElement) => void;
export interface IconLibrary {
  name: string;
  resolver: IconLibraryResolver;
  mutator?: IconLibraryMutator;
}

let registry: IconLibrary[] = [defaultLibrary, systemLibrary];
let watchedIcons: Icon[] = [];

/** Adds an icon to the list of watched icons. */
export function watchIcon(icon: Icon) {
  watchedIcons.push(icon);
}

/** Removes an icon from the list of watched icons. */
export function unwatchIcon(icon: Icon) {
  watchedIcons = watchedIcons.filter(el => el !== icon);
}

/** Returns a library from the registry. */
export function getIconLibrary(name?: string) {
  return registry.find(lib => lib.name === name);
}

/** Removes an icon library from the registry. */
export function unregisterIconLibrary(name: string) {
  registry = registry.filter(lib => lib.name !== name);
}

/** Adds an icon library to the registry, or overrides an existing one. */
export function registerIconLibrary(
  name: string,
  options: { resolver: IconLibraryResolver; mutator?: IconLibraryMutator },
) {
  unregisterIconLibrary(name);
  registry.push({
    name,
    resolver: options.resolver,
    mutator: options.mutator,
  });

  // Redraw watched icons
  watchedIcons.forEach((icon) => {
    if (icon.library === name) {
      icon.setIcon();
    }
  });
}
