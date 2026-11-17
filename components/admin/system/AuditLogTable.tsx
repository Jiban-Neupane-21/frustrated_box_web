'use client';

import React, { useState } from 'react';
import { AuditLogEntry } from '@/types/admin-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Search, Download, ShieldAlert } from 'lucide-react';

interface AuditLogsTableProps {
  logs: AuditLogEntry[];
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(
    (log) =>
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `frustratedbox-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <Card className="border-zinc-800/80 bg-[#0a0a0a] text-zinc-100 shadow-none">
      <CardHeader className="flex flex-col gap-4 border-b border-zinc-900 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
            <FileText className="h-4 w-4 text-[#991b1b]" />
            System Audit Trail & Compliance Logs
          </CardTitle>
          <p className="text-xs text-zinc-500 mt-1">
            Immutable log record tracking every administrative action and configuration mutation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <Input
              placeholder="Search action, target, actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-zinc-800 bg-[#050505] pl-8 text-xs text-white focus-visible:ring-[#991b1b]"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 hover:text-white text-xs shrink-0"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export JSON
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="border-zinc-900 bg-zinc-950/50">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-400 text-xs">Timestamp</TableHead>
              <TableHead className="text-zinc-400 text-xs">Actor</TableHead>
              <TableHead className="text-zinc-400 text-xs">Action Type</TableHead>
              <TableHead className="text-zinc-400 text-xs">Target / Resource</TableHead>
              <TableHead className="text-zinc-400 text-xs">Metadata & Diff</TableHead>
              <TableHead className="text-right text-zinc-400 text-xs">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow className="border-zinc-900">
                <TableCell colSpan={6} className="h-24 text-center text-xs text-zinc-500">
                  No matching audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-zinc-900 hover:bg-zinc-900/40">
                  <TableCell className="py-3 text-xs font-mono text-zinc-400">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="font-medium text-white text-xs">{log.actor.name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{log.actor.handle}</div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px] font-mono">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-medium text-zinc-200">
                    {log.target}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-zinc-400 font-mono">
                    {log.metadata}
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs font-mono text-zinc-500">
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}