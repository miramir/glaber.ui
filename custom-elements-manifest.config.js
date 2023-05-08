/* eslint-disable no-param-reassign */
import { parse } from 'comment-parser';
import fs from 'fs';

const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const { name, description, version, author, homepage, license } = packageData;

export default {
  globs: ['src/**/*.ts'],
  exclude: ['**/*.styles.ts', '**/*.test.ts', 'src/locales.ts', 'src/ui.ts'],
  litelement: true,
  outdir: 'docs',
  plugins: [
    // Append package data
    {
      name: 'package-data',
      packageLinkPhase({ customElementsManifest }) {
        customElementsManifest.package = { name, description, version, author, homepage, license };
      },
    },
    // Parse custom jsDoc tags
    {
      name: 'custom-tags',
      analyzePhase({ ts, node, moduleDoc }) {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
          const className = node.name.getText();
          const classDoc = moduleDoc?.declarations?.find(d => d.name === className);
          const customTags = ['dependency', 'documentation', 'since', 'status', 'title'];
          let customComments = '/**';

          node.jsDoc?.forEach((jsDoc) => {
            jsDoc?.tags?.forEach((tag) => {
              const tagName = tag.tagName.getText();

              if (customTags.includes(tagName)) {
                customComments += `\n * @${tagName} ${tag.comment}`;
              }
            });
          });

          const parsed = parse(`${customComments}\n */`);
          if (parsed.length !== 0) {
            parsed[0].tags?.forEach((t) => {
              switch (t.tag) {
                // Dependencies
                case 'dependency':
                  if (!Array.isArray(classDoc.dependencies)) {
                    classDoc.dependencies = [];
                  }
                  classDoc.dependencies.push(t.name);
                  break;

                // Value-only metadata tags
                case 'documentation':
                case 'since':
                case 'status':
                case 'title':
                  classDoc[t.tag] = t.name;
                  break;

                // All other tags
                default:
                  if (!Array.isArray(classDoc[t.tag])) {
                    classDoc[t.tag] = [];
                  }

                  classDoc[t.tag].push({
                    name: t.name,
                    description: t.description,
                    type: t.type || undefined,
                  });
              }
            });
          }
        }
      },
    },
  ],
};
