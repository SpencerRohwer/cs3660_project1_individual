import React, { useState, useEffect } from 'react';
import { Upload, Search, Star, Eye, Download, Heart, Filter, User, LogOut } from 'lucide-react';

// Main App Component
const ResourcesHub = () => {
  // State management for core functionality
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentUser] = useState({ 
    name: 'John Doe', 
    id: 1, 
    role: 'student' 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  // Mock data representing database entries
  const mockProjects = [
    {
      id: 1,
      title: 'E-Commerce Website',
      description: 'A full-stack e-commerce application with user authentication, shopping cart, and payment processing.',
      author: { id: 2, name: 'Jane Smith' },
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      liveUrl: 'https://demo-ecommerce.com',
      repositoryUrl: 'https://github.com/janesmith/ecommerce',
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      createdAt: '2025-04-15T10:30:00Z',
      rating: 4.5,
      reviewCount: 12,
      viewCount: 145,
      downloadCount: 23,
      files: ['index.html', 'app.js', 'styles.css', 'package.json']
    },
    {
      id: 2,
      title: 'Personal Portfolio',
      description: 'A responsive portfolio website showcasing web development projects with modern design.',
      author: { id: 3, name: 'Mike Johnson' },
      technologies: ['Vue.js', 'SCSS', 'Firebase'],
      liveUrl: 'https://mike-portfolio.dev',
      repositoryUrl: 'https://github.com/mikejohnson/portfolio',
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      createdAt: '2025-04-10T14:20:00Z',
      rating: 4.8,
      reviewCount: 8,
      viewCount: 89,
      downloadCount: 15,
      files: ['index.vue', 'components/', 'assets/', 'firebase.json']
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates and team features.',
      author: { id: 4, name: 'Sarah Lee' },
      technologies: ['Angular', 'Express', 'PostgreSQL', 'Socket.io'],
      liveUrl: 'https://taskmaster-app.com',
      repositoryUrl: 'https://github.com/sarahlee/taskmaster',
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      createdAt: '2025-04-05T09:15:00Z',
      rating: 4.2,
      reviewCount: 15,
      viewCount: 203,
      downloadCount: 31,
      files: ['app.component.ts', 'server.js', 'database.sql', 'socket-config.js']
    }
  ];

  // Initialize projects and apply filters
  useEffect(() => {
    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
  }, []);

  // Filter projects based on search query and technology
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply technology filter
    if (selectedTech) {
      filtered = filtered.filter(project =>
        project.technologies.includes(selectedTech)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedTech]);

  // Handle project upload
  const handleUploadProject = (projectData) => {
    const newProject = {
      id: projects.length + 1,
      ...projectData,
      author: currentUser,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviewCount: 0,
      viewCount: 0,
      downloadCount: 0,
      thumbnailUrl: 'https://via.placeholder.com/300x200'
    };

    setProjects([newProject, ...projects]);
    setShowUploadModal(false);
    alert('Project uploaded successfully!');
  };

  // Toggle favorite status
  const toggleFavorite = (projectId) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(projectId)) {
      newFavorites.delete(projectId);
    } else {
      newFavorites.add(projectId);
    }
    setFavorites(newFavorites);
  };

  // Get unique technologies for filter dropdown
  const availableTechnologies = [...new Set(projects.flatMap(p => p.technologies))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Resources Hub</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {currentUser.name}</span>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <User size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {selectedProject ? (
          <ProjectDetail 
            project={selectedProject} 
            onBack={() => setSelectedProject(null)}
            isFavorited={favorites.has(selectedProject.id)}
            onToggleFavorite={() => toggleFavorite(selectedProject.id)}
          />
        ) : (
          <>
            {/* Search and Filter Section */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Technologies</option>
                  {availableTechnologies.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
                <button className="p-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={20} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Upload size={20} />
                  Upload Project
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  My Projects
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Favorites
                </button>
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isFavorited={favorites.has(project.id)}
                  onToggleFavorite={() => toggleFavorite(project.id)}
                  onViewProject={() => setSelectedProject(project)}
                />
              ))}
            </div>

            {/* No Results Message */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTech('');
                  }}
                  className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadProject}
        />
      )}
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, isFavorited, onToggleFavorite, onViewProject }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Project Thumbnail */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <img 
          src={project.thumbnailUrl} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Project Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {project.description}
        </p>
        <p className="text-sm text-gray-500 mb-3">by {project.author.name}</p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.map(tech => (
            <span
              key={tech}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span>{project.rating.toFixed(1)} ({project.reviewCount})</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {project.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Download size={14} />
              {project.downloadCount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onViewProject}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            View Project
          </button>
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded ${
              isFavorited 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600'
            } hover:bg-red-200`}
          >
            <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Project Detail Component
const ProjectDetail = ({ project, onBack, isFavorited, onToggleFavorite }) => {
  const [currentTab, setCurrentTab] = useState('details');

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Back to Gallery
        </button>
        
        <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-600 mb-4">
          by {project.author.name} • Uploaded: {new Date(project.createdAt).toLocaleDateString()}
        </p>

        {/* Rating and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-current" size={20} />
              <span className="font-semibold">{project.rating.toFixed(1)}</span>
              <span className="text-gray-500">({project.reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onToggleFavorite}
              className={`px-4 py-2 rounded ${
                isFavorited 
                  ? 'bg-red-100 text-red-600 border border-red-200' 
                  : 'border border-gray-300 text-gray-600'
              } hover:bg-red-50`}
            >
              <Heart size={16} className={`inline mr-2 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Favorited' : 'Favorite'}
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Project Preview */}
      <div className="p-6 border-b">
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-600 mb-2">Live Project Preview</p>
            <p className="text-gray-500">Click to interact with the live demo</p>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                View Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-b">
        <div className="flex gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              View Live
            </a>
          )}
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download size={20} className="inline mr-2" />
            Download Files
          </button>
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              GitHub
            </a>
          )}
          <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            Write Review
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex border-b">
          {['details', 'reviews', 'files', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                currentTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {currentTab === 'details' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Technologies Used:</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Description:</h3>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Project Features:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Responsive design optimized for all device sizes</li>
                <li>User authentication and authorization system</li>
                <li>Real-time data updates and notifications</li>
                <li>Comprehensive testing suite with 90%+ coverage</li>
                <li>Modern development practices and clean code architecture</li>
              </ul>
            </div>
          </div>
        )}

        {currentTab === 'reviews' && (
          <ReviewsSection />
        )}

        {currentTab === 'files' && (
          <FilesSection project={project} />
        )}

        {currentTab === 'history' && (
          <HistorySection project={project} />
        )}
      </div>
    </div>
  );
};

// Reviews Section Component
const ReviewsSection = () => {
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  const submitReview = () => {
    if (newReview.rating > 0 && newReview.comment.trim()) {
      alert('Review submitted successfully!');
      setNewReview({ rating: 0, comment: '' });
    } else {
      alert('Please provide both a rating and comment.');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Reviews & Comments</h3>
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold">Prof. Sarah Johnson</span>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">2 days ago</span>
          </div>
          <p className="text-gray-700">
            Excellent implementation of the shopping cart functionality. 
            The code is well-structured and follows best practices. Great job!
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold">Alex Chen</span>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">1 week ago</span>
          </div>
          <p className="text-gray-700">
            Love the clean UI design and smooth user experience. 
            The payment integration works flawlessly!
          </p>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="mt-6 border-t pt-6">
        <h4 className="font-semibold mb-3">Add Your Review:</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={24} 
                  className={`cursor-pointer ${
                    i < newReview.rating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                  onClick={() => setNewReview({...newReview, rating: i + 1})}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts about this project..."
            />
          </div>
          <button 
            onClick={submitReview}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

// Files Section Component
const FilesSection = ({ project }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Project Files</h3>
      <div className="space-y-2">
        {project.files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-mono text-sm">{file}</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                View
              </button>
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Total size: 2.4 MB • Last updated: {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Download All
          </button>
        </div>
      </div>
    </div>
  );
};

// History Section Component
const HistorySection = ({ project }) => {
  const versions = [
    {
      version: 'v1.2.0',
      date: project.createdAt,
      message: 'Added payment processing and improved UI design',
      isCurrent: true
    },
    {
      version: 'v1.1.0',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Implemented shopping cart functionality',
      isCurrent: false
    },
    {
      version: 'v1.0.0',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Initial project submission',
      isCurrent: false
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Version History</h3>
      <div className="space-y-4">
        {versions.map((version, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold">{version.version}</span>
                {version.isCurrent && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    Current
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(version.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mb-2">{version.message}</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                View Changes
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Upload Modal Component
const UploadModal = ({ onClose, onUpload }) => {
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    repositoryUrl: '',
    files: []
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (field, value) => {
    setUploadData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files) => {
    setUploadData(prev => ({ 
      ...prev, 
      files: Array.from(files).map(file => file.name)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!uploadData.title || !uploadData.description || uploadData.files.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Process technologies string into array
    const technologies = uploadData.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);

    onUpload({
      ...uploadData,
      technologies
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upload New Project</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your project..."
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                value={uploadData.technologies}
                onChange={(e) => handleInputChange('technologies', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
              />
            </div>

            {/* Live Demo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Demo URL (optional)
              </label>
              <input
                type="url"
                value={uploadData.liveUrl}
                onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            {/* Repository URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repository URL (optional)
              </label>
              <input
                type="url"
                value={uploadData.repositoryUrl}
                onChange={(e) => handleInputChange('repositoryUrl', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Files *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 mb-2">Drag files here or</p>
                <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
                {uploadData.files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Uploaded files:</p>
                    <ul className="text-sm text-gray-800 mt-2">
                      {uploadData.files.map((file, index) => (
                        <li key={index} className="font-mono">{file}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Upload Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesHub;
