'use client';

import React from 'react';
import { SystemServiceMetric, ServiceStatus } from '@/types/admin-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Database, Globe, RefreshCw, Server } from 'lucide-react';

interface HealthStatusGridProps {
  metrics: SystemServiceMetric[];
  isRefreshing: boolean;
  onRefresh: () => void;
}

const statusConfig: Record<
  ServiceStatus,
  { label: string; dotColor: string; badgeClass: string }
> = {
  operational: {
    label: 'Operational',
    dotColor: 'bg-emerald-500',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  },
  degraded: {
    label: 'Degraded',
    dotColor: 'bg-amber-500',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  },
  down: {
    label: 'Outage',
    dotColor: 'bg-[#991b1b]',
    badgeClass: 'border-[#991b1b]/50 bg-[#991b1b]/20 text-red-400',
  },
};

const serviceIconMap: Record<SystemServiceMetric['id'], React.ReactNode> = {
  api: <Server className="h-4 w-4 text-zinc-400" />,
  database: <Database className="h-4 w-4 text-zinc-400" />,
  edge: <Globe className="h-4 w-4 text-zinc-400" />,
};

export function HealthStatusGrid({
  metrics,
  isRefreshing,
  onRefresh,
}: HealthStatusGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#991b1b]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Infrastructure Telemetry
          </h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-900 hover:text-white"
        >
          <RefreshCw
            className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          {isRefreshing ? 'Pinging...' : 'Ping Services'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((service) => {
          const status = statusConfig[service.status];

          return (
            <Card
              key={service.id}
              className="border-zinc-800/80 bg-[#0a0a0a] text-zinc-100 shadow-none"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
                    {serviceIconMap[service.id]}
                    {service.name}
                  </CardTitle>
                  <p className="text-xs text-zinc-500">{service.provider}</p>
                </div>

                <Badge variant="outline" className={status.badgeClass}>
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status.dotColor}`}
                  />
                  {status.label}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between border-y border-zinc-900 py-2.5">
                  <div>
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {service.latencyMs}
                    </span>
                    <span className="ml-1 text-xs text-zinc-500">ms</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-zinc-200">
                      {service.uptimePercent}%
                    </span>
                    <p className="text-[11px] text-zinc-500">30d uptime</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>{service.details}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}