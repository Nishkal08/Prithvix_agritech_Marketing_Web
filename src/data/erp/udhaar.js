import { farmers } from './farmers';

// Derive Udhaar data from farmers who have outstanding amounts
export const udhaarData = farmers
  .filter(f => f.outstandingAmount > 0)
  .map(f => ({
    farmerId: f.id,
    farmerName: f.name,
    village: f.village,
    avatar: f.avatar,
    amountDue: f.outstandingAmount,
    daysOverdue: f.daysOverdue || 0,
    lastPaymentDate: f.lastPaymentDate || 'N/A',
    lastPaymentAmount: f.lastPaymentAmount || 0,
    creditLimit: f.creditLimit || 15000,
  }));
