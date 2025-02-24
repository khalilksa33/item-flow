
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { AuditLog as AuditLogType } from "@/types/inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AuditLog() {
  const [logs, setLogs] = useState<AuditLogType[]>([]);

  useEffect(() => {
    const auditLogs = storage.getAuditLogs();
    setLogs(auditLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Audit Log</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const user = storage.getUsers().find(u => u.id === log.userId);
            return (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.date)}</TableCell>
                <TableCell className="capitalize">{log.action}</TableCell>
                <TableCell>{user?.username || 'Unknown'}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
