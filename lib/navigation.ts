// Navigation items configuration for consistent navigation across components
import { IconType } from "react-icons";

interface NavItem {
  label: string;
  href: string;
  icon?: IconType;
}

// Note: Using Lucide React icons directly in the component
// This config provides the label and href for each navigation item
export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Unit", href: "/convert" },
  { label: "Currency", href: "/currency" },
  { label: "Search", href: "/search" },
] as const;