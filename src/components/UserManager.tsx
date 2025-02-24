
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/lib/storage";
import { User } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface UserManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserManager({ isOpen, onClose }: UserManagerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(storage.getUsers());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: User = {
      id: editingUser?.id || crypto.randomUUID(),
      username: formData.username!,
      password: formData.password!,
      role: formData.role || 'viewer',
    };

    if (editingUser) {
      storage.updateUser(userData);
      toast.success("User updated successfully");
    } else {
      storage.addUser(userData);
      toast.success("User added successfully");
    }

    setEditingUser(undefined);
    setFormData({});
    loadUsers();
  };

  const handleDelete = (id: string) => {
    storage.deleteUser(id);
    loadUsers();
    toast.success("User deleted successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Users</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                placeholder={editingUser ? "Leave blank to keep current" : ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.role || "viewer"}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              required
            >
              <option value="viewer">Viewer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit">
            {editingUser ? "Update" : "Add"} User
          </Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
