import { createContext, useContext } from 'react';
import { buildPermissions } from '../config/roles';

export const RoleContext = createContext(null);

/**
 * Hook for any component to check role/permissions.
 * Usage: const { role, can, isDealer, isStaff } = useRole();
 */
export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) return buildPermissions('dealer'); // fallback during loading
  return ctx;
}
