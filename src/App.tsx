import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PhoneEmulator } from './components/PhoneEmulator';
import { PropertiesPanel } from './components/PropertiesPanel';

function App() {
  const [selectedComponent, setSelectedComponent] = useState<any>({ type: 'image', id: 'image-1' });
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [lottieData, setLottieData] = useState<any>(null);
  const [riveData, setRiveData] = useState<ArrayBuffer | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<string>('Image / Animation');
  const [showAvatar, setShowAvatar] = useState<boolean>(true);
  const [avatarImage, setAvatarImage] = useState<string>('');
  const [customText, setCustomText] = useState<string>('Title');

  const handleAddComponent = (componentType: string) => {
    if (componentType === 'image') {
      setSelectedComponent({ type: 'image', id: 'image-1' });
    }
  };

  const handleSelectComponent = (component: any) => {
    setSelectedComponent(component);
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setLottieData(null);
    setRiveData(null);
  };

  const handleLottieUpload = (data: any) => {
    setLottieData(data);
    setUploadedImage('');
    setRiveData(null);
  };

  const handleRiveUpload = (data: ArrayBuffer) => {
    setRiveData(data);
    setUploadedImage('');
    setLottieData(null);
    setAudioFile(null);
  };

  const handleAudioUpload = (file: File) => {
    setAudioFile(file);
    setUploadedImage('');
    setLottieData(null);
    setRiveData(null);
  };

  const handleMediaTypeChange = (newMediaType: string) => {
    setMediaType(newMediaType);
    // Clear current media when switching types
    setUploadedImage('');
    setLottieData(null);
    setRiveData(null);
    setAudioFile(null);
    
    // Update selected component type
    if (newMediaType === 'Audio') {
      setSelectedComponent({ type: 'audio', id: 'audio-1' });
    } else {
      setSelectedComponent({ type: 'image', id: 'image-1' });
    }
  };

  const handleAvatarImageUpload = (imageUrl: string) => {
    setAvatarImage(imageUrl);
  };

  const handleTextChange = (text: string) => {
    setCustomText(text);
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      <Sidebar onAddComponent={handleAddComponent} />
      <PhoneEmulator 
        selectedComponent={selectedComponent}
        onSelectComponent={handleSelectComponent}
        uploadedImage={uploadedImage}
        lottieData={lottieData}
        riveData={riveData}
        mediaType={mediaType}
        audioFile={audioFile}
        showAvatar={showAvatar}
        avatarImage={avatarImage}
        customText={customText}
      />
      <PropertiesPanel 
        selectedComponent={selectedComponent} 
        onImageUpload={handleImageUpload}
        onLottieUpload={handleLottieUpload}
        onRiveUpload={handleRiveUpload}
        onAudioUpload={handleAudioUpload}
        onMediaTypeChange={handleMediaTypeChange}
        showAvatar={showAvatar}
        onAvatarToggle={(show: boolean) => {
          console.log('Avatar toggle:', show);
          setShowAvatar(show);
        }}
        onAvatarImageUpload={handleAvatarImageUpload}
        onTextChange={handleTextChange}
      />
    </div>
  );
}

export default App;