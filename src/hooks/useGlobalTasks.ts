import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Task } from '../types';
import { toast } from 'react-toastify';

export function useGlobalTasks() {
  const [globalTasks, setGlobalTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadGlobalTasks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('global_tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setGlobalTasks(data.map(task => ({
        id: task.id,
        name: task.name,
        hours: task.hours,
        isCustom: false
      })));
    } catch (error: any) {
      console.error('Error loading global tasks:', error);
      toast.error('Failed to load global tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGlobalTasks();
  }, []);

  return {
    globalTasks,
    isLoading,
    refresh: loadGlobalTasks
  };
}