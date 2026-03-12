import { useAllProfiles, useSuspendUser } from '@/hooks/useProfiles';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAllProfiles();
  const suspendUser = useSuspendUser();

  if (isLoading) return <AdminLayout><div className="text-center py-16 text-muted-foreground">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h2 className="font-display text-2xl font-bold mb-6">User Management</h2>
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium">{u.name || 'Unnamed'}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3"><span className="capitalize text-xs px-2 py-0.5 rounded-full bg-muted">{u.role}</span></td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_suspended ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'}`}>
                    {u.is_suspended ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="p-3">
                  {u.role !== 'admin' && (
                    <Button
                      size="sm"
                      variant={u.is_suspended ? 'default' : 'destructive'}
                      onClick={() => {
                        suspendUser.mutate({ userId: u.id, suspended: !u.is_suspended });
                        toast.success(u.is_suspended ? 'User reactivated' : 'User suspended');
                      }}
                    >
                      {u.is_suspended ? 'Reactivate' : 'Suspend'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
