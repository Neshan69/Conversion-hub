// Navigation items configuration for consistent navigation across components

// Note: Using Lucide React icons directly in the component
// This config provides the label and href for each navigation item
export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Unit", href: "/unit" },
  { label: "Currency", href: "/currency" },
  { label: "Search", href: "/search" },
] as const;
