import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMechanics } from '@/lib/api';
import type { Mechanic, MechanicsResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MechanicDetailsModal } from '@/components/mechanics/MechanicDetailsModal';
import { Wrench, Star, CheckCircle, Clock, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  string,
  { label: string; className: string; dotClass: string }
> = {
  available: {
    label: 'Available',
    className:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 dark:border-emerald-500/50 font-semibold',
    dotClass: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
  },
  busy: {
    label: 'Busy',
    className:
      'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40 dark:border-blue-500/50 font-semibold',
    dotClass: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.7)]',
  },
  on_break: {
    label: 'On Break',
    className:
      'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 dark:border-amber-500/50 font-semibold',
    dotClass: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]',
  },
  offline: {
    label: 'Offline',
    className:
      'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/40 dark:border-slate-500/50 font-semibold',
    dotClass: 'bg-slate-400 dark:bg-slate-500',
  },
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'on_break', label: 'On Break' },
  { value: 'offline', label: 'Offline' },
];

export function MechanicsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery<MechanicsResponse>({
    queryKey: ['mechanics', status, search],
    queryFn: () =>
      getMechanics({
        status: status || undefined,
        search: search || undefined,
      }),
    refetchInterval: 30000,
  });

  const handleOpenMechanic = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mechanics</h2>
          <p className="text-muted-foreground text-sm">
            {data?.stats?.available ?? 0} available · {data?.stats?.busy ?? 0} busy ·{' '}
            {data?.stats?.on_break ?? 0} on break
          </p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search mechanics by name..."
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mechanics Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.mechanics?.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center flex flex-col items-center justify-center">
          <p className="text-base font-semibold text-foreground">No mechanics found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || status
              ? 'Try clearing or changing your search query or status filter.'
              : 'No mechanics are currently registered.'}
          </p>
          {(search || status) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4 text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.mechanics?.map((mechanic: Mechanic) => {
            const currentStatus = statusConfig[mechanic.status] || {
              label: mechanic.status.replace('_', ' '),
              className:
                'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/40 font-semibold',
              dotClass: 'bg-slate-400',
            };

            return (
              <Card
                key={mechanic.id}
                onClick={() => handleOpenMechanic(mechanic)}
                className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
                title="Click to view mechanic details"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {mechanic.avatar ? (
                        <img
                          src={mechanic.avatar}
                          alt={mechanic.name}
                          className="h-12 w-12 rounded-full object-cover ring-1 ring-border group-hover:ring-primary transition-all"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {mechanic.name[0] || <Wrench className="h-5 w-5" />}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {mechanic.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">
                            {mechanic.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Improved High-Visibility Status Badge */}
                    <Badge
                      variant="outline"
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border shadow-2xs shrink-0',
                        currentStatus.className
                      )}
                    >
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full shrink-0',
                          currentStatus.dotClass
                        )}
                      />
                      <span>{currentStatus.label}</span>
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        Jobs Done
                      </div>
                      <p className="text-lg font-semibold mt-1">
                        {mechanic.totalJobsCompleted}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        Current
                      </div>
                      <p className="text-sm font-medium mt-1 truncate">
                        {mechanic.currentBooking
                          ? mechanic.currentBooking.service
                          : 'No active job'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {mechanic.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Mechanic Details Modal */}
      <MechanicDetailsModal
        mechanic={selectedMechanic}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}