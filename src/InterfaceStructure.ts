export interface InterfaceStructure {
    parent: string;
    path: string;
    name: string;
    type: string;
    recursiveCount: number;
    children: InterfaceStructure[] | null;
}

export function matchesSearch(node: InterfaceStructure, search: string): boolean {
    if (node.path.toLowerCase().includes(search)) return true;
    return node.children?.some((child) => matchesSearch(child, search)) ?? false;
}