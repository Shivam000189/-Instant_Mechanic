import { useQuery } from '@tanstack/react-query';
import { getMechanics } from '@/lib/api';
import type { Mechanic, MechanicsResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Wrench, Star, CheckCircle, Clock } from 'lucide-react';

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  busy: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  on_break: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  offline: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
};

export function MechanicsPage() {
  const { data, isLoading } = useQuery<MechanicsResponse>({
    queryKey: ['mechanics'],
    queryFn: () => getMechanics(),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mechanics</h2>
          <p className="text-muted-foreground">Team overview</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mechanics</h2>
          <p className="text-muted-foreground">
            {data?.stats?.available} available · {data?.stats?.busy} busy · {data?.stats?.on_break} on break
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.mechanics?.map((mechanic: Mechanic) => (
          <Card key={mechanic.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {mechanic.avatar ? (
                    <img
                      src={mechanic.avatar}
                      alt={mechanic.name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{mechanic.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">
                        {mechanic.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[mechanic.status] || ''}
                >
                  {mechanic.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Jobs Done
                  </div>
                  <p className="text-lg font-semibold mt-1">
                    {mechanic.totalJobsCompleted}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Clock className="h-3.5 w-3.5" />
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
        ))}
      </div>
    </div>
  );
}