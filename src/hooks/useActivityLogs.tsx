
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description?: string;
  metadata?: any;
  created_at: string;
}

export const useActivityLogs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['activity_logs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as ActivityLog[];
    },
    enabled: !!user?.id,
  });

  const logActivityMutation = useMutation({
    mutationFn: async ({ action, description, metadata }: { 
      action: string; 
      description?: string; 
      metadata?: any 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: user.id,
          action,
          description,
          metadata
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity_logs', user?.id] });
    }
  });

  return {
    logs,
    isLoading,
    logActivity: logActivityMutation.mutate,
    isLogging: logActivityMutation.isPending,
  };
};
