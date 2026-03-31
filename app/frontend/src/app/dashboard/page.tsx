import { useLogout } from '@/hooks/login/use-logout';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { handleLogout } = useLogout();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">STK Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Keluar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Selamat Datang!</h2>
          {user && (
            <div className="space-y-2 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Nama:</span> {user.fullName}
              </p>
              <p>
                <span className="font-medium text-foreground">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium text-foreground">Role:</span>{' '}
                <span className="capitalize">{user.role.toLowerCase().replace('_', ' ')}</span>
              </p>
              <p>
                <span className="font-medium text-foreground">Status:</span>{' '}
                <span
                  className={
                    user.status === 'ACTIVE'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {user.status === 'ACTIVE' ? 'Aktif' : 'Dinonaktifkan'}
                </span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
