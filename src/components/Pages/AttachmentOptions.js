import React, { useState } from 'react';
import { 
  FaFileAlt,    
  FaHeadphones, // Audio
  FaImages,     // Gallery
  FaImage,      // Image
  FaMapMarker,  // Location
  FaCalendar,   // Event
  FaCamera      // Camera
} from 'react-icons/fa';

const AttachmentOptions = ({ isOpen, onClose }) => {
  const attachmentOptions = [
    { icon: <FaFileAlt size={20} />, label: 'Document', action: 'openDocument' },
    { icon: <FaHeadphones size={20} />, label: 'Audio', action: 'openAudio' },
    { icon: <FaImages size={20} />, label: 'Gallery', action: 'openGallery' },
    { icon: <FaImage size={20} />, label: 'Image', action: 'openImage' },
    { icon: <FaMapMarker size={20} />, label: 'Location', action: 'openLocation' },
    { icon: <FaCalendar size={20} />, label: 'Event', action: 'openEvent' },
    { icon: <FaCamera size={20} />, label: 'Camera', action: 'openCamera' }
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
    onClose(); // Close the options menu after selecting
  };

  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc,.docx,.pdf,.txt';  // Accept document types
    input.click();
  };

  // Open file picker for audio
  const openAudioPicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';  // Accept audio types
    input.click();
  };

  const openGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';  // Accept image types
    input.multiple = true;     // Allow multiple images
    input.click();
  };

  const openImagePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';  // Accept image types
    input.click();
  };

  const openLocationPicker = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location:', position.coords.latitude, position.coords.longitude);
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
          // Display the camera stream in a video element or take photo
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          document.body.appendChild(video);  // Append video to the body
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
    <div 
      style={{
        position: 'absolute',
        bottom: '70px', 
        left: '10px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        width: '250px',
        zIndex: 100
      }}
    >
      {attachmentOptions.map((option, index) => (
        <div 
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33.33%',
            padding: '10px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onClick={() => handleAction(option.action)}  // Trigger the appropriate action
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}  // Hover effect to enlarge
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}   // Return to normal size
        >
          <div 
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '5px',
              transition: 'background-color 0.3s ease',
            }}
          >
            {option.icon}
          </div>
          <small>{option.label}</small>
        </div>
      ))}
    </div>
  );
};

export default AttachmentOptions;
