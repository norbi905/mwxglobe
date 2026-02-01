import { useState } from 'react';
import "../App.css";
import { getImageUrl } from '../utils/imageLoader';

export default function SideDrawer({ project, onClose }) {
  const [activeMedia, setActiveMedia] = useState<any | null>(null);

  if (!project) return null;

  // Helper to convert standard links to Embed links
  const getEmbedUrl = (src: string) => {
    if (!src) return "";
    
    // Handle YouTube
    if (src.includes('youtube.com/watch?v=')) {
      const videoId = src.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (src.includes('youtu.be/')) {
      const videoId = src.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle Google Drive
    if (src.includes('drive.google.com')) {
      // Replaces /view or /edit with /preview
      return src.replace(/\/view.*|\/edit.*/, '/preview');
    }
    
    return src;
  };

  return (
    <>
      <div className="side-drawer glass-panel">
        <button 
            type="button" 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close drawer"
        >
            ✕
        </button>
        
        <div className="drawer-content">
          <div className="drawer-header">
             <span className="category-tag">Project Detail</span>
             <h2>{project.title}</h2>
          </div>
          
          <p className="description">{project.description}</p>
          
          <div className="media-gallery">
            {project.details?.media?.map((item, index) => (
              <div 
                className="media-card" 
                key={`media-${index}`}
                onClick={() => setActiveMedia(item)}
              >
                {item.type === 'image' ? (
                  <img src={getImageUrl(item.src)} alt={item.caption} />
                ) : (
                  <div className="video-thumb-placeholder">
                    <div className="play-icon">▶</div>
                    <span className="video-label">Play Video</span>
                  </div>
                )}
                <div className="media-info">
                  <span>{item.caption}</span>
                </div>
              </div>
            ))}
          </div>
          {/* NEW: Project Links Section */}
          {project.details?.links && project.details.links.length > 0 && (
            <div className="project-links-container">
              <h3 className="section-label">Resources</h3>
              <div className="links-grid">
                {project.details.links.map((link, idx) => (
                  <a 
                    key={`link-${idx}`} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="action-link-button glass-button"
                  >
                    <span className="link-icon">↗</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Glass Media Overlay */}
      {activeMedia && (
        <div className="full-screen-overlay glass-morph-overlay" onClick={() => setActiveMedia(null)}>
          <div className="overlay-close">✕</div>
          
          <div className="overlay-content-wrapper" onClick={(e) => e.stopPropagation()}>
            {activeMedia.type === 'image' ? (
              <img src={getImageUrl(activeMedia.src)} className="maximized-media" alt="Full view" />
            ) : (
              <div className="iframe-container" style={{ width: '100%', minWidth: '100%'}}>
                <iframe
                  src={getEmbedUrl(activeMedia.src)}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <div className="overlay-caption">{activeMedia.caption}</div>
          </div>
        </div>
      )}
    </>
  );
}