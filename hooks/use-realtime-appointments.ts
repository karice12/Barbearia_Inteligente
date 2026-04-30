'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

export interface RealtimeAppointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  serviceId: string;
  serviceName?: string;
  servicePrice?: number;
  barberId: string | null;
  barberName?: string;
  appointmentDate: string;
  status: string;
  notes: string | null;
  price: number | null;
  createdAt: string;
}

interface UseRealtimeAppointmentsOptions {
  date?: string; // ISO date string, defaults to today
  barberId?: string; // filter by specific barber
}

export function useRealtimeAppointments(options: UseRealtimeAppointmentsOptions = {}) {
  const [appointments, setAppointments] = useState<RealtimeAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  const targetDate = options.date || new Date().toISOString().split('T')[0];

  const fetchAppointments = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Determine the owner_id to filter by
      const ownerId = user.ownerId || user.id;

      let query = supabase
        .from('appointments')
        .select(
          `
          id,
          customer_name,
          customer_phone,
          service_id,
          barber_id,
          appointment_date,
          status,
          notes,
          price,
          created_at,
          services (name, price)
        `
        )
        .eq('user_id', ownerId)
        .gte('appointment_date', `${targetDate}T00:00:00.000Z`)
        .lte('appointment_date', `${targetDate}T23:59:59.999Z`)
        .order('appointment_date', { ascending: true });

      // Barbers only see their own appointments
      if (user.role === 'barber') {
        query = query.eq('barber_id', user.id);
      } else if (options.barberId) {
        query = query.eq('barber_id', options.barberId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching appointments:', fetchError.message);
        setError('Erro ao carregar agendamentos.');
        return;
      }

      const mapped: RealtimeAppointment[] = (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        customerId: row.user_id as string,
        customerName: row.customer_name as string,
        customerPhone: row.customer_phone as string | null,
        serviceId: row.service_id as string,
        serviceName: (row.services as Record<string, unknown> | null)?.name as string | undefined,
        servicePrice: (row.services as Record<string, unknown> | null)?.price as number | undefined,
        barberId: row.barber_id as string | null,
        appointmentDate: row.appointment_date as string,
        status: row.status as string,
        notes: row.notes as string | null,
        price: row.price as number | null,
        createdAt: row.created_at as string,
      }));

      setAppointments(mapped);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erro inesperado ao carregar agendamentos.');
    } finally {
      setIsLoading(false);
    }
  }, [user, targetDate, options.barberId, supabase]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const ownerId = user.ownerId || user.id;

    const channel = supabase
      .channel(`appointments_realtime_${ownerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${ownerId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as Record<string, unknown>;
            const newAppt: RealtimeAppointment = {
              id: newRow.id as string,
              customerId: newRow.user_id as string,
              customerName: newRow.customer_name as string,
              customerPhone: newRow.customer_phone as string | null,
              serviceId: newRow.service_id as string,
              barberId: newRow.barber_id as string | null,
              appointmentDate: newRow.appointment_date as string,
              status: newRow.status as string,
              notes: newRow.notes as string | null,
              price: newRow.price as number | null,
              createdAt: newRow.created_at as string,
            };
            setAppointments((prev) => [...prev, newAppt]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedRow = payload.new as Record<string, unknown>;
            setAppointments((prev) =>
              prev.map((apt) =>
                apt.id === updatedRow.id
                  ? {
                      ...apt,
                      status: updatedRow.status as string,
                      notes: updatedRow.notes as string | null,
                      price: updatedRow.price as number | null,
                    }
                  : apt
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedRow = payload.old as Record<string, unknown>;
            setAppointments((prev) => prev.filter((apt) => apt.id !== deletedRow.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const updateAppointmentStatus = useCallback(
    async (appointmentId: string, status: string) => {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (updateError) {
        console.error('Error updating appointment status:', updateError.message);
        return { error: updateError.message };
      }
      return {};
    },
    [supabase]
  );

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments,
    updateAppointmentStatus,
  };
}
