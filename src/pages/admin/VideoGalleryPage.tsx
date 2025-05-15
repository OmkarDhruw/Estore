import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Pencil, Trash2, Play, Pause, ExternalLink, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchVideoItems, 
  createVideoItem, 
  updateVideoItem, 
  deleteVideoItem, 
  VideoItem, 
  VideoItemForm 
} from '../../services/videoGallery.service';

// Base64 converter for media
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const VideoGalleryPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [form, setForm] = useState<VideoItemForm>({
    title: '',
    description: '',
    newPrice: 0,
    oldPrice: 0,
    socialMediaUrl: '',
  });
  
  // Refs for video players
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  // Fetch video items
  const { data: videoItems = [], isLoading, isError } = useQuery({
    queryKey: ['videoItems'],
    queryFn: fetchVideoItems
  });
  
  // Mutations
  const createMutation = useMutation({
    mutationFn: createVideoItem,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['videoItems']});
      toast.success('Video item created successfully');
      handleCloseEditor();
    },
    onError: () => {
      toast.error('Failed to create video item');
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateVideoItem,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['videoItems']});
      toast.success('Video item updated successfully');
      handleCloseEditor();
    },
    onError: () => {
      toast.error('Failed to update video item');
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteVideoItem,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['videoItems']});
      toast.success('Video item deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete video item');
    },
  });
  
  // Editor handlers
  const handleOpenEditor = (videoItem?: VideoItem) => {
    if (videoItem) {
      setForm({
        title: videoItem.title,
        description: videoItem.description,
        newPrice: videoItem.newPrice,
        oldPrice: videoItem.oldPrice,
        socialMediaUrl: videoItem.socialMediaUrl,
        mediaPreview: videoItem.videoUrl,
      });
      setEditingId(videoItem._id);
    } else {
      setForm({
        title: '',
        description: '',
        newPrice: 0,
        oldPrice: 0,
        socialMediaUrl: '',
      });
      setEditingId(null);
    }
    setIsEditing(true);
  };
  
  const handleCloseEditor = () => {
    setIsEditing(false);
    setForm({
      title: '',
      description: '',
      newPrice: 0,
      oldPrice: 0,
      socialMediaUrl: '',
    });
    setEditingId(null);
  };
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: name === 'newPrice' || name === 'oldPrice' ? parseFloat(value) : value 
    }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      setForm((prev) => ({
        ...prev,
        media: file,
        mediaPreview: preview,
      }));
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Error processing file');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!form.title || form.newPrice <= 0 || form.oldPrice <= 0) {
        return toast.error('Please fill in all required fields');
      }
      
      if (!editingId && !form.media) {
        return toast.error('Please select a video');
      }
      
      // Prepare data for API
      let base64Media = '';
      
      if (form.media instanceof File) {
        base64Media = await convertToBase64(form.media);
      }
      
      const payload = {
        title: form.title,
        description: form.description || '',
        newPrice: form.newPrice,
        oldPrice: form.oldPrice,
        socialMediaUrl: form.socialMediaUrl || '',
        ...(base64Media && { media: base64Media })
      };
      
      if (editingId) {
        // Update existing video item
        await updateMutation.mutateAsync({ 
          id: editingId, 
          formData: payload
        });
      } else {
        // Create new video item
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save video item');
    }
  };
  
  // Delete handler
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video item?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };
  
  // Video playback controls
  const togglePlayPause = (id: string) => {
    const videoRef = videoRefs.current[id];
    if (!videoRef) return;
    
    if (isPlaying === id) {
      videoRef.pause();
      setIsPlaying(null);
    } else {
      // Pause other playing videos
      if (isPlaying) {
        const previousVideo = videoRefs.current[isPlaying];
        if (previousVideo) {
          previousVideo.pause();
        }
      }
      
      // Play the selected video
      videoRef.play().catch(err => console.log("Could not play video:", err));
      setIsPlaying(id);
    }
  };
  
  // Loading and error states
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  if (isError) {
    return <div className="text-center py-8 text-red-500">Error loading video gallery items</div>;
  }
  
  // Render main view or edit form
  if (isEditing) {
    // Edit form view
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Video Gallery</h1>
        </div>
        
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? 'Edit Video Item' : 'Add New Video Item'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left column - Form fields */}
              <div className="flex-1">
                <div className="mb-4">
                  <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
                    Video File (MP4 recommended)
                  </label>
                  <input
                    type="file"
                    id="media"
                    name="media"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a high-quality video for best results</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      New Price*
                    </label>
                    <input
                      type="number"
                      id="newPrice"
                      name="newPrice"
                      value={form.newPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Old Price*
                    </label>
                    <input
                      type="number"
                      id="oldPrice"
                      name="oldPrice"
                      value={form.oldPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="socialMediaUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media URL
                  </label>
                  <input
                    type="url"
                    id="socialMediaUrl"
                    name="socialMediaUrl"
                    value={form.socialMediaUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://instagram.com/your-profile"
                  />
                </div>
              </div>
              
              {/* Right column - Preview */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">Preview</h3>
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {form.mediaPreview ? (
                    <div className="relative">
                      <div className="max-w-[300px] mx-auto">
                        <video
                          src={form.mediaPreview}
                          controls
                          className="w-full aspect-[9/16] object-contain"
                        />
                      </div>
                      <div className="mt-4 p-4 border-t border-gray-200">
                        <h4 className="font-medium">{form.title || 'Video Title'}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-pink-600 font-bold">₹{form.newPrice.toFixed(2)}</span>
                          {form.oldPrice > 0 && (
                            <span className="ml-2 text-gray-500 line-through">₹{form.oldPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-400">No video selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer with buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCloseEditor}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Video Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Main list view
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Video Gallery</h1>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Videos</h2>
          <button
            onClick={() => handleOpenEditor()}
            className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add New Video
          </button>
        </div>
        
        <div className="mt-8">
          {videoItems.length === 0 ? (
            <p className="py-6 text-center text-gray-500">No videos found. Add your first one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoItems.map((videoItem) => (
                <div key={videoItem._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="relative aspect-[9/16] bg-black max-w-[300px] mx-auto">
                    <video
                      ref={(el) => {
                        videoRefs.current[videoItem._id] = el;
                      }}
                      src={videoItem.videoUrl}
                      poster={videoItem.thumbnail}
                      className="w-full h-full object-contain"
                      onClick={() => togglePlayPause(videoItem._id)}
                    />
                    {isPlaying !== videoItem._id && (
                      <button
                        onClick={() => togglePlayPause(videoItem._id)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white"
                      >
                        <Play size={48} className="opacity-80" />
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{videoItem.title}</h3>
                    {videoItem.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{videoItem.description}</p>
                    )}
                    
                    <div className="flex items-center mb-3">
                      <span className="text-pink-600 font-bold">₹{videoItem.newPrice.toFixed(2)}</span>
                      <span className="ml-2 text-gray-500 line-through">₹{videoItem.oldPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="space-x-1">
                        <button
                          onClick={() => handleOpenEditor(videoItem)}
                          className="text-blue-600 p-2 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(videoItem._id)}
                          className="text-red-600 p-2 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      {videoItem.socialMediaUrl && (
                        <a
                          href={videoItem.socialMediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 p-2 hover:bg-gray-50 rounded"
                          title="Social Media Link"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGalleryPage; 