import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export function useSSE() {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) return;

    const es = new EventSource(`${API_URL}/events/live`);

    es.onopen = () => {
      console.log('🔌 SSE Connected');
    };

    es.addEventListener('booking_update', (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('📡 Real-time update:', payload);

        // Invalidate and refetch bookings
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['mechanics'] });
        queryClient.invalidateQueries({ queryKey: ['notifications-bookings'] });
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    });

    es.onerror = (err) => {
      console.error('SSE error:', err);
      es.close();
      eventSourceRef.current = null;
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    eventSourceRef.current = es;
  }, [queryClient]);

  const disconnect = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connect, disconnect };
}