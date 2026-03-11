import { useStore } from '@/contexts/AppContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { allUsers, suspendUser } = useStore();

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
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3"><span className="capitalize text-xs px-2 py-0.5 rounded-full bg-muted">{u.role}</span></td>
                <td className="p-3">
                  {u.role !== 'admin' && (
                    <Button size="sm" variant="destructive" onClick={() => { suspendUser(u.id); toast.success('User suspended'); }}>
                      Suspend
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
