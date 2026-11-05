import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { resolve } from 'node:path';

const original = fs.readFileSync;
const target = resolve('packages/system/src/composition-recipes.json');
fs.readFileSync = function (path, options) {
  const result = original.call(this, path, options);
  if (typeof path !== 'string' || resolve(path) !== target) {
    return result;
  }
  const recipes = JSON.parse(result.toString());
  recipes[0].components.push('MissingRecipeComponent');
  return JSON.stringify(recipes);
};
syncBuiltinESMExports();
