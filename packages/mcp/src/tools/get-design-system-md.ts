import { renderSystemMd } from '@egdev/system';
import type { Artifact } from '../artifact.js';

export function getDesignSystemMd(data: Artifact): string {
  return renderSystemMd(data);
}
