
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppInstance {
  id: string;
  user_id: string;
  instance_name: string;
  instance_key?: string;
  qr_code?: string;
  status: string;
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

export const useWhatsAppInstances = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: instances, isLoading } = useQuery({
    queryKey: ['whatsapp_instances', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WhatsAppInstance[];
    },
    enabled: !!user?.id,
  });

  const createInstanceMutation = useMutation({
    mutationFn: async (instanceData: Partial<WhatsAppInstance>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert([{
          ...instanceData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_instances', user?.id] });
      toast({
        title: "Instância criada!",
        description: "Nova instância do WhatsApp criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar instância",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const updateInstanceMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<WhatsAppInstance> & { id: string }) => {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_instances', user?.id] });
      toast({
        title: "Instância atualizada!",
        description: "Dados da instância atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar instância",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  return {
    instances,
    isLoading,
    createInstance: createInstanceMutation.mutate,
    updateInstance: updateInstanceMutation.mutate,
    isCreating: createInstanceMutation.isPending,
    isUpdating: updateInstanceMutation.isPending,
  };
};
