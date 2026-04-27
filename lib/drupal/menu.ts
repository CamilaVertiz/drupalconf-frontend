import type { MenuItem } from './types';
import { drupalFetch } from './client';

const JSON_API_PREFIX = '/api/jsonapi';

interface MenuItemResource {
  id: string;
  attributes: {
    title: string;
    url: string | null;
    weight: number;
    enabled: boolean;
    expanded: boolean;
    description: string | null;
    parent: string;
  };
}

export async function getMenu(name: string): Promise<MenuItem[]> {
  const json = await drupalFetch<{ data?: MenuItemResource[] }>(
    `${JSON_API_PREFIX}/menu_items/${name}`,
  );
  return buildTree(json.data ?? []);
}

function buildTree(resources: MenuItemResource[]): MenuItem[] {
  const byId = new Map<string, MenuItem>();
  const parentOf = new Map<string, string>();

  for (const r of resources) {
    if (!r.attributes.enabled) continue;
    byId.set(r.id, {
      title: r.attributes.title,
      url: r.attributes.url ?? null,
      weight: r.attributes.weight ?? 0,
      enabled: r.attributes.enabled,
      expanded: r.attributes.expanded,
      description: r.attributes.description ?? null,
      children: [],
    });
    parentOf.set(r.id, r.attributes.parent || '');
  }

  const roots: MenuItem[] = [];
  for (const [id, item] of byId) {
    const parentId = parentOf.get(id) ?? '';
    const parent = parentId ? byId.get(parentId) : undefined;
    if (parent) parent.children.push(item);
    else roots.push(item);
  }

  const sortByWeight = (items: MenuItem[]): MenuItem[] => {
    items.sort((a, b) => a.weight - b.weight);
    items.forEach((item) => sortByWeight(item.children));
    return items;
  };
  return sortByWeight(roots);
}
