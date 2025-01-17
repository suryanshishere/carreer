// type Role = "publisher" | "admin";

export interface NavItem {
  role?: string[];
  link: string;
}

export interface NestedNavItems {
  [key: string]: NavItem;
}

export interface INavAccData {
  [key: string]: NavItem | NestedNavItems | null;
}
