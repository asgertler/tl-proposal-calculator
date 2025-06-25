import { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Plus, Menu, X } from 'lucide-react';
import { useProjectPersistence, type SavedProject } from '../hooks/useProjectPersistence';
import { useProposalContext } from '../context/ProposalContext';
import { toast } from 'react-toastify';

const ProjectManager = () => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showProjectDrawer, setShowProjectDrawer] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);
  
  const {
    isLoading,
    savedProjects,
    saveProject,
    updateProject,
    loadProjects,
    deleteProject,
    isAuthenticated
  } = useProjectPersistence();
  
  const { personnel, burnPlan, loadProjectData } = useProposalContext();

  useEffect(() => {
    loadProjects();
  }, [isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save projects');
      return;
    }

    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const projectData = {
      personnel,
      burnPlan
    };

    if (selectedProject) {
      await updateProject(selectedProject.id, projectName, projectData);
      toast.success('Project updated successfully');
    } else {
      await saveProject(projectName, projectData);
      toast.success('Project saved successfully');
    }

    setShowSaveDialog(false);
    setProjectName('');
    setSelectedProject(null);
  };

  const handleLoad = async (project: SavedProject) => {
    try {
      loadProjectData(project.data);
      setSelectedProject(project);
      setProjectName(project.name);
      setShowProjectDrawer(false);
      toast.success('Project loaded successfully');
    } catch (error) {
      toast.error('Failed to load project');
      console.error('Error loading project:', error);
    }
  };

  const handleDelete = async (project: SavedProject) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(project.id);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl">Project Manager</h2>
        <div className="flex gap-2">
          <button
            className="space-button-outline flex items-center gap-2"
            onClick={() => {
              setSelectedProject(null);
              setProjectName('');
              setShowSaveDialog(true);
            }}
          >
            <Plus size={18} />
            New Project
          </button>
          <button
            className="space-button flex items-center gap-2"
            onClick={() => setShowSaveDialog(true)}
          >
            <Save size={18} />
            Save Current
          </button>
          <button
            className="space-button-outline flex items-center gap-2"
            onClick={() => setShowProjectDrawer(true)}
          >
            <Menu size={18} />
            Projects
          </button>
        </div>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="space-card w-full max-w-md">
            <h3 className="text-lg mb-4">
              {selectedProject ? 'Update Project' : 'Save Project'}
            </h3>
            <input
              type="text"
              placeholder="Project name"
              className="space-input mb-4"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="space-button-outline"
                onClick={() => {
                  setShowSaveDialog(false);
                  setSelectedProject(null);
                  setProjectName('');
                }}
              >
                Cancel
              </button>
              <button
                className="space-button"
                onClick={handleSave}
              >
                {selectedProject ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProjectDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-space-black">
            <div className="flex items-center justify-between p-6 border-b border-space-gray-700">
              <h3 className="text-lg">Saved Projects</h3>
              <button
                className="text-space-gray-300 hover:text-white"
                onClick={() => setShowProjectDrawer(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
              {savedProjects.map(project => (
                <div
                  key={project.id}
                  className="space-card"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-space-gray-300">
                        Last updated: {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-space-blue-light hover:text-space-blue"
                        onClick={() => handleLoad(project)}
                      >
                        <FolderOpen size={18} />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(project)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {savedProjects.length === 0 && (
                <div className="text-center text-space-gray-300 py-8">
                  No saved projects yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;