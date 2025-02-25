
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const { currentUser } = useUser();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Check if current user is already admin
    if (currentUser && currentUser.role === 'admin') {
      localStorage.setItem('adminAuth', 'true');
      onLogin();
      toast.success('Logged in as admin');
      return;
    }

    // Traditional admin login
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      onLogin();
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("admin.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("auth.username")}</Label>
              <Input
                id="username"
                name="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">{t("auth.login")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
