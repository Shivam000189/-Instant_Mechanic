import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
  to?: string;
}

export function StatCard({ title, value, description, icon: Icon, isLoading, to }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="rounded-xl border border-border/70 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-5 w-5 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </CardContent>
      </Card>
    );
  }

  const content = (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs transition-all duration-300",
        to
          ? "cursor-pointer hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.99]"
          : "hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-normal">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline select-none">
        {content}
      </Link>
    );
  }

  return content;
}