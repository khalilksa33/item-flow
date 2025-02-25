
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/contexts/UserContext";
import { storage } from "@/lib/storage";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Initialize some default users if none exist
  const initializeDefaultUsers = () => {
    const users = storage.getUsers();
    if (users.length === 0) {
      // Add default admin user
      storage.addUser({
        id: "admin-1",
        username: "admin",
        password: "admin123",
        role: "admin",
        lastLogin: new Date().toISOString()
      });
      
      // Add default manager user with all permissions except admin
      storage.addUser({
        id: "manager-1",
        username: "manager",
        password: "manager123",
        role: "manager",
        lastLogin: new Date().toISOString()
      });
    }
  };

  // Initialize users on component mount
  useEffect(() => {
    initializeDefaultUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError(t("auth.required"));
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError(t("auth.invalid"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("auth.login")}</CardTitle>
          <CardDescription>
            {t("auth.pleaseLogin")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">{t("auth.username")}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("auth.enterUsername")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.enterPassword")}
              />
            </div>
            <Button type="submit" className="w-full">
              {t("auth.login")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 justify-center">
          <div>
            {t("auth.defaultUsers")}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
