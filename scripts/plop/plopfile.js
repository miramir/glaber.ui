/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable func-names */

const componentActions = [
  {
    type: 'add',
    path: '../../src/components/{{ tag }}/{{ tag }}.ts',
    templateFile: 'templates/component/component.hbs',
  },
  {
    type: 'add',
    path: '../../src/components/{{ tag }}/{{ tag }}.styles.ts',
    templateFile: 'templates/component/styles.hbs',
  },
  {
    type: 'add',
    path: '../../src/components/{{ tag }}/{{ tag }}.test.ts',
    templateFile: 'templates/component/tests.hbs',
  },
  {
    type: 'add',
    path: '../../docs/components/{{ tag }}.md',
    templateFile: 'templates/component/docs.hbs',
  },
  {
    type: 'modify',
    path: '../../docs/_sidebar.md',
    pattern: /<!--plop:component-->/,
    template: `- [{{ tagToTitle tag }}](/components/{{ tag }})\n  <!--plop:component-->`,
  },
  {
    type: 'modify',
    path: '../../src/ui.ts',
    pattern: /\/\* plop:component \*\//,
    // eslint-disable-next-line max-len
    template: `export { default as {{ properCase tag }} } from './components/{{ tag }}/{{ tag }}';\n/* plop:component */`,
  },
];

export default function (plop) {
  plop.setHelper('tagToTitle', (tag) => {
    const titleCase = plop.getHelper('titleCase');
    return titleCase(tag.replace(/-/g, ' '));
  });

  plop.setGenerator('component', {
    description: 'Generate a new component',
    prompts: [
      {
        type: 'input',
        name: 'tag',
        message: 'Tag name? (e.g. host-nav)',
        validate: (value) => {
          // No double dashes or ending dash
          if (value.includes('--') || value.endsWith('-')) {
            return false;
          }

          return true;
        },
      },
    ],
    actions: componentActions,
  });

  plop.setGenerator('event', {
    description: 'Generate a new event',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Event name? (e.g. after-show)',
        validate: (value) => {
          // No double dashes or ending dash
          if (value.includes('--') || value.endsWith('-')) {
            return false;
          }

          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../../src/events/glb-{{ name }}.ts',
        templateFile: 'templates/event.hbs',
      },
      {
        type: 'modify',
        path: '../../src/ui.ts',
        pattern: /\/\* plop:event \*\//,
        // eslint-disable-next-line max-len
        template: `export { default as Glb{{ properCase name }}Event } from './events/glb-{{ name }}';\n/* plop:event */`,
      },
    ],
  });
}
