import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PaymentHistoryTableProps {
  rolePermissions: {
    isAdmin: boolean;
    isCollector: boolean;
    isMember: boolean;
    hasMultipleRoles: boolean;
  };
}

const PaymentHistoryTable = ({ rolePermissions }: PaymentHistoryTableProps) => {
  const { data: payments, isLoading, isError } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading payment history.</div>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Member Number</th>
          <th>Payment Type</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(payment => (
          <tr key={payment.id}>
            <td>{payment.member_number}</td>
            <td>{payment.payment_type}</td>
            <td>£{payment.amount}</td>
            <td>{payment.status}</td>
            <td>
              {rolePermissions.isAdmin && (
                <Button variant="outline">View Details</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PaymentHistoryTable;
