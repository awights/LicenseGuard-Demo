import { LicenseStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: LicenseStatus;
  daysUntilExpiry?: number;
}

export default function StatusBadge({ status, daysUntilExpiry }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800',
          icon: '✓',
          label: 'Active',
        };
      case 'expiring-soon':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: '⚠️',
          label: daysUntilExpiry ? `Expires in ${daysUntilExpiry}d` : 'Expiring Soon',
        };
      case 'expired':
        return {
          color: 'bg-red-100 text-red-800',
          icon: '✗',
          label: 'Expired',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}
