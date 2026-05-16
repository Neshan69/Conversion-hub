// Navigation items configuration for consistent navigation across components

interface NavItem {
  label: string;
  href: string;
  icon?: unknown;
}

// Note: Using Lucide React icons directly in the component
// This config provides the label and href for each navigation item
export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Unit", href: "/convert" },
  { label: "Currency", href: "/currency" },
  { label: "Search", href: "/search" },
] as const;