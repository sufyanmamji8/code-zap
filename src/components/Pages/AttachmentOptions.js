import React, { useState } from 'react';
import { 
  FaFileAlt,    
  FaHeadphones,
  FaImages,
  FaImage,
  FaMapMarker,
  FaCalendar,
  FaCamera,
  FaTimes
} from 'react-icons/fa';

const AttachmentOptions = ({ isOpen, onClose }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const attachmentOptions = [
    { 
      icon: <FaFileAlt size={22} />, 
      label: 'Document', 
      action: 'openDocument',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      icon: <FaHeadphones size={22} />, 
      label: 'Audio', 
      action: 'openAudio',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      icon: <FaImages size={22} />, 
      label: 'Gallery', 
      action: 'openGallery',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      icon: <FaImage size={22} />, 
      label: 'Image', 
      action: 'openImage',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      icon: <FaMapMarker size={22} />, 
      label: 'Location', 
      action: 'openLocation',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      icon: <FaCalendar size={22} />, 
      label: 'Event', 
      action: 'openEvent',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    { 
      icon: <FaCamera size={22} />, 
      label: 'Camera', 
      action: 'openCamera',
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  ];

  const handleAction = (action) => {
    switch (action) {
      case 'openDocument':
        openFilePicker();
        break;
      case 'openAudio':
        openAudioPicker();
        break;
      case 'openGallery':
        openGallery();
        break;
      case 'openImage':
        openImagePicker();
        break;
      case 'openLocation':
        openLocationPicker();
        break;
      case 'openEvent':
        openEventPicker();
        break;
      case 'openCamera':
        openCamera();
        break;
      default:
        console.log('Action not defined');
    }
    onClose();
  };

  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc,.docx,.pdf,.txt,.ppt,.pptx,.xls,.xlsx';
    input.click();
  };

  const openAudioPicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.click();
  };

  const openGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.click();
  };

  const openImagePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
  };

  const openLocationPicker = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location:', position.coords.latitude, position.coords.longitude);
          // You can send this location data to your chat
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.log('Geolocation not supported');
    }
  };

  const openEventPicker = () => {
    // You could integrate a calendar API here
    console.log('Opening event picker...');
  };

  const openCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          document.body.appendChild(video);
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    } else {
      console.log('Camera access not supported');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={onClose}
      />
      
      {/* Attachment Options Panel */}
      <div 
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          padding: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          width: '320px',
          zIndex: 1000,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'slideUp 0.3s ease'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0, 0, 0, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: '#666'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.2)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <FaTimes size={14} />
        </button>

        <h4 
          style={{
            width: '100%',
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2d3748',
            textAlign: 'center'
          }}
        >
          Attach File
        </h4>

        {attachmentOptions.map((option, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '25%',
              padding: '12px 8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredItem === index ? 'translateY(-5px)' : 'translateY(0)',
            }}
            onClick={() => handleAction(option.action)}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div 
              style={{
                background: option.color,
                borderRadius: '16px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                transition: 'all 0.3s ease',
                boxShadow: hoveredItem === index 
                  ? '0 10px 25px rgba(0, 0, 0, 0.2)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: hoveredItem === index ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              <div style={{ color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                {option.icon}
              </div>
            </div>
            <small 
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: hoveredItem === index ? '#667eea' : '#4a5568',
                textAlign: 'center',
                transition: 'color 0.2s ease'
              }}
            >
              {option.label}
            </small>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @media (max-width: 480px) {
            .attachment-panel {
              left: 10px !important;
              right: 10px !important;
              width: auto !important;
              bottom: 70px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default AttachmentOptions;
