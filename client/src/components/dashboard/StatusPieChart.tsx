import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StatusBreakdown } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completed', color: '#10b981' },
  in_progress: { label: 'In Progress', color: '#3b82f6' },
  assigned: { label: 'Assigned', color: '#8b5cf6' },
  on_the_way: { label: 'On The Way', color: '#06b6d4' },
  pending: { label: 'Pending', color: '#f59e0b' },
  cancelled: { label: 'Cancelled', color: '#f43f5e' },
};

function formatStatus(status: string): string {
  const normalized = status?.toLowerCase() || '';
  return (
    STATUS_CONFIG[normalized]?.label ||
    status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function getStatusColor(status: string): string {
  const normalized = status?.toLowerCase() || '';
  return STATUS_CONFIG[normalized]?.color || '#8884d8';
}

interface Props {
  data: StatusBreakdown[];
  isLoading?: boolean;
}

export function StatusPieChart({ data = [], isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="rounded-xl border border-border/80 bg-card">
        <CardHeader>
          <Skeleton className="h-5 w-40 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  const validData = data.filter((item) => item && typeof item.count === 'number' && item.count > 0);
  const totalBookings = validData.reduce((acc, curr) => acc + curr.count, 0);

  const chartData = validData.map((entry) => ({
    ...entry,
    name: formatStatus(entry.status),
    color: getStatusColor(entry.status),
  }));

  return (
    <Card className="rounded-xl border border-border/80 bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Booking Status Breakdown</CardTitle>
        <span className="text-xs text-muted-foreground font-normal">
          {totalBookings} Total
        </span>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">
              📊
            </div>
            <p>No status data available</p>
          </div>
        ) : (
          <div className="relative h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as {
                        name: string;
                        count: number;
                        percentage?: number;
                        color: string;
                      };
                      return (
                        <div className="rounded-lg border border-border bg-card p-2.5 shadow-lg text-xs">
                          <div className="flex items-center gap-2 font-semibold">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between gap-4 text-muted-foreground">
                            <span>Bookings:</span>
                            <span className="font-bold text-foreground">{item.count}</span>
                          </div>
                          {item.percentage !== undefined && (
                            <div className="flex items-center justify-between gap-4 text-muted-foreground">
                              <span>Share:</span>
                              <span className="font-medium text-foreground">{item.percentage}%</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: any) => (
                    <span className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Summary in Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {totalBookings}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Jobs
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}