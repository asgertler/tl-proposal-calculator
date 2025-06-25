import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

export interface SavedProject {
  id: string;
  name: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export function useProjectPersistence() {
  const [isLoading, setIsLoading] = useState(false);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the current user's ID when the hook is initialized
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    
    initAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const saveProject = async (name: string, data: any) => {
    try {
      if (!userId) {
        toast.error('Please sign in to save projects');
        return null;
      }

      setIsLoading(true);
      const { data: savedProject, error } = await supabase
        .from('saved_projects')
        .insert([{ 
          name, 
          data,
          user_id: userId
        }])
        .select()
        .single();

      if (error) throw error;

      setSavedProjects(prev => [...prev, savedProject]);
      toast.success('Project saved successfully');
      return savedProject;
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
      console.error('Error saving project:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: string, name: string, data: any) => {
    try {
      if (!userId) {
        toast.error('Please sign in to update projects');
        return null;
      }

      setIsLoading(true);
      const { data: updatedProject, error } = await supabase
        .from('saved_projects')
        .update({ name, data })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      setSavedProjects(prev => 
        prev.map(p => p.id === id ? updatedProject : p)
      );
      toast.success('Project updated successfully');
      return updatedProject;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update project');
      console.error('Error updating project:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      if (!userId) {
        setSavedProjects([]);
        return [];
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('saved_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setSavedProjects(data);
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to load projects');
      console.error('Error loading projects:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      if (!userId) {
        toast.error('Please sign in to delete projects');
        return;
      }

      setIsLoading(true);
      const { error } = await supabase
        .from('saved_projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setSavedProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
      console.error('Error deleting project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    savedProjects,
    saveProject,
    updateProject,
    loadProjects,
    deleteProject,
    isAuthenticated: !!userId
  };
}