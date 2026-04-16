/**
 * Role-based permission definitions for Prithvix ERP Portal.
 * Single source of truth — imported by RoleContext.
 */

export const ROLES = {
  DEALER: 'dealer',
  STAFF:  'staff',
};

/** Pages / features staff cannot access at all */
const DEALER_ONLY = new Set([
  'udhaar.modify',      // record payment, settle, mark paid
  'analytics.financial',// revenue chart, collection rate donut
  'settings.billing',   // billing & subscription
  'settings.team',      // team management
  'dashboard.revenue',  // revenue KPIs and sparkline
  'farmers.delete',     // delete farmer record
  'inventory.pricing',  // see/edit product purchase price / margins
]);

/**
 * Returns a `can(action)` function for the given role.
 * Dealer can do everything; Staff is denied DEALER_ONLY actions.
 */
export function buildPermissions(role) {
  return {
    role,
    can(action) {
      if (role === ROLES.DEALER) return true;
      return !DEALER_ONLY.has(action);
    },
    canAccessPage(page) {
      // Staff can VIEW all pages but some have restricted actions
      // No full page blocks — only action-level blocks
      return true;
    },
  };
}

/** Nav items visible to ALL roles */
export const SHARED_NAV_ITEMS = [
  'Dashboard',
  'Farmers',
  'Inventory',
  'Analytics',
  'Crop Calendar',
  'AI Chat',
  'Settings',
];

/** Nav items only visible to Dealers */
export const DEALER_NAV_ITEMS = [
  'Udhaar',
];
