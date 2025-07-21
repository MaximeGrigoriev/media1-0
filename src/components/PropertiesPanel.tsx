import React, { useState } from 'react';
import { Upload, ChevronDown, Move, MoreHorizontal } from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponent: any;
  onImageUpload: (imageUrl: string) => void;
  onLottieUpload: (lottieData: any) => void;
  onRiveUpload: (riveData: ArrayBuffer) => void;
  onAudioUpload: (audioFile: File) => void;
  onMediaTypeChange: (mediaType: string) => void;
  showAvatar?: boolean;
  onAvatarToggle?: (show: boolean) => void;
  onAvatarImageUpload?: (imageUrl: string) => void;
  onTextChange?: (text: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedComponent, 
  onImageUpload, 
  onLottieUpload, 
  onRiveUpload, 
  onAudioUpload,
  onMediaTypeChange,
  showAvatar = true,
  onAvatarToggle,
  onAvatarImageUpload,
  onTextChange
}) => {
  const [imageSettings, setImageSettings] = useState({
    visible: 'Yes',
    offsetTop: 16,
    offsetBottom: 16,
    offsetRight: 0,
    position: 'In content',
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#ffffff',
    backgroundOpacity: 100,
    roundness: 0,
    borderWidth: 0,
    borderColor: '#ffffff',
    borderOpacity: 100,
    zIndex: 1,
    width: 100,
    widthUnit: '%',
    height: 200,
    heightUnit: 'px',
    imageRoundness: 0,
    opacity: 100,
    align: 'Center',
    showAvatar: true,
    customText: ''
  });

  const [mediaType, setMediaType] = useState('Image / Animation');

  const updateSetting = (key: string, value: any) => {
    setImageSettings(prev => ({ ...prev, [key]: value }));
    
    // Синхронизируем состояние аватара с родительским компонентом
    if (key === 'showAvatar' && onAvatarToggle) {
      onAvatarToggle(value);
    }
  };

  const handleMediaTypeChange = (newMediaType: string) => {
    setMediaType(newMediaType);
    onMediaTypeChange(newMediaType);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (mediaType === 'Audio' && file.type.startsWith('audio/')) {
        onAudioUpload(file);
      } else if (file.type.startsWith('image/') || file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          onImageUpload(imageUrl);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonContent = e.target?.result as string;
            const lottieData = JSON.parse(jsonContent);
            onLottieUpload(lottieData);
          } catch (error) {
            console.error('Invalid JSON file:', error);
            alert('Please select a valid Lottie JSON file');
          }
        };
        reader.readAsText(file);
      } else if (file.name.endsWith('.riv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const riveData = e.target.result as ArrayBuffer;
            onRiveUpload(riveData);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarImageUpload) {
      if (file.type.startsWith('image/') || file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          if (onAvatarImageUpload) {
            onAvatarImageUpload(imageUrl);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonContent = e.target?.result as string;
            const lottieData = JSON.parse(jsonContent);
            // Конвертируем JSON в base64 для передачи
            const base64 = btoa(jsonContent);
            if (onAvatarImageUpload) {
              onAvatarImageUpload(`data:application/json;base64,${base64}`);
            }
          } catch (error) {
            console.error('Invalid JSON file:', error);
            alert('Please select a valid Lottie JSON file');
          }
        };
        reader.readAsText(file);
      } else if (file.name.endsWith('.riv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const riveData = e.target.result as ArrayBuffer;
            // Конвертируем ArrayBuffer в base64 для передачи
            const base64 = btoa(String.fromCharCode(...new Uint8Array(riveData)));
            if (onAvatarImageUpload) {
              onAvatarImageUpload(`data:application/octet-stream;base64,${base64}`);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
      {/* Media Type and Upload Button */}
      <div className="p-4 border-b border-gray-700">
        {/* Media Type Dropdown */}
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-2">Media Type:</label>
          <div className="relative">
            <select
              value={mediaType}
              onChange={(e) => handleMediaTypeChange(e.target.value)}
              className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded appearance-none border border-gray-600 focus:border-cyan-400 focus:outline-none"
            >
              <option>Image / Animation</option>
              <option>Audio</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        {/* Upload Button */}
        <div className="relative">
          <input
            type="file"
            accept={mediaType === 'Audio' ? 'audio/*' : 'image/*,.gif,.json,.riv'}
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded border border-cyan-400 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </label>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto">
        {/* Avatar Setting for Audio */}
        {mediaType === 'Audio' && (
          <div className="p-4 border-b border-gray-700">
            {/* Text Section */}
            <div className="mb-6">
              <label className="block text-xs text-gray-400 mb-2">Text</label>
              <input
                type="text"
                value={imageSettings.customText}
                onChange={(e) => {
                  const newText = e.target.value;
                  updateSetting('customText', newText);
                  if (onTextChange) {
                    onTextChange(newText);
                  }
                }}
                placeholder="Enter text..."
                className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Avatar</label>
              <div className="flex gap-1">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      const newValue = option === 'Yes';
                      updateSetting('showAvatar', newValue);
                    }}
                    className={`px-3 py-1 text-xs rounded ${
                      (option === 'Yes' ? showAvatar : !showAvatar)
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Upload Avatar Button - показывается только когда Avatar = Yes */}
            {showAvatar && (
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.gif,.json,.riv"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded border border-cyan-400 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Upload avatar
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Container Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">CONTAINER</h3>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          <div className="space-y-4">
            {/* Visible */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Visible</label>
              <div className="flex gap-1">
                {['Yes', 'Conditional', 'No'].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting('visible', option)}
                    className={`px-3 py-1 text-xs rounded ${
                      imageSettings.visible === option
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Offset */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Offset</label>
              <div className="grid grid-cols-4 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    value={imageSettings.offsetTop}
                    onChange={(e) => updateSetting('offsetTop', parseInt(e.target.value))}
                    className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded"
                  />
                  <Move className="absolute right-1 top-1 w-3 h-3 text-gray-500" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={imageSettings.offsetBottom}
                    onChange={(e) => updateSetting('offsetBottom', parseInt(e.target.value))}
                    className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded"
                  />
                  <Move className="absolute right-1 top-1 w-3 h-3 text-gray-500 rotate-90" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={imageSettings.offsetRight}
                    onChange={(e) => updateSetting('offsetRight', parseInt(e.target.value))}
                    className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded"
                  />
                  <span className="absolute right-1 top-1 text-xs text-gray-500">%</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={0}
                    className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded"
                  />
                  <span className="absolute right-1 top-1 text-xs text-gray-500">px</span>
                </div>
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Position</label>
              <div className="relative">
                <select
                  value={imageSettings.position}
                  onChange={(e) => updateSetting('position', e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded appearance-none"
                >
                  <option>In content</option>
                  <option>Absolute</option>
                  <option>Fixed</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Padding */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Padding</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={imageSettings.paddingLeft}
                    onChange={(e) => updateSetting('paddingLeft', parseInt(e.target.value))}
                    className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded"
                  />
                  <span className="absolute right-1 top-1 text-xs text-gray-500">%</span>
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={imageSettings.paddingRight}
                    onChange={(e) => updateSetting('paddingRight', parseInt(e.target.value))}
                    className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded"
                  />
                  <span className="absolute right-1 top-1 text-xs text-gray-500">px</span>
                </div>
              </div>
            </div>

            {/* Background */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Background</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-600"
                  style={{ backgroundColor: imageSettings.backgroundColor }}
                ></div>
                <input
                  type="text"
                  value={imageSettings.backgroundColor}
                  onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                />
                <span className="text-xs text-gray-400">{imageSettings.backgroundOpacity}%</span>
              </div>
            </div>

            {/* Roundness */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Roundness</label>
              <div className="flex items-center gap-2">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={imageSettings.roundness}
                  onChange={(e) => updateSetting('roundness', parseInt(e.target.value))}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                />
                <span className="text-xs text-gray-400">px</span>
              </div>
            </div>

            {/* Border */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Border</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">W</span>
                <input
                  type="number"
                  value={imageSettings.borderWidth}
                  onChange={(e) => updateSetting('borderWidth', parseInt(e.target.value))}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                />
                <span className="text-xs text-gray-400">px</span>
              </div>
            </div>

            {/* Border Color */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Border Color</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-600"
                  style={{ backgroundColor: imageSettings.borderColor }}
                ></div>
                <input
                  type="text"
                  value={imageSettings.borderColor}
                  onChange={(e) => updateSetting('borderColor', e.target.value)}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                />
                <span className="text-xs text-gray-400">{imageSettings.borderOpacity}%</span>
              </div>
            </div>

            {/* Z Index */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Z Index</label>
              <input
                type="number"
                value={imageSettings.zIndex}
                onChange={(e) => updateSetting('zIndex', parseInt(e.target.value))}
                className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded"
              />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">IMAGE</h3>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          <div className="space-y-4">
            {/* Width */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Width</label>
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={imageSettings.width}
                  onChange={(e) => updateSetting('width', parseInt(e.target.value))}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                />
                <select
                  value={imageSettings.widthUnit}
                  onChange={(e) => updateSetting('widthUnit', e.target.value)}
                  className="bg-gray-800 text-white text-sm px-2 py-1 rounded"
                >
                  <option>%</option>
                  <option>px</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Height</label>
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-gray-500 rotate-90" />
                <input
                  type="number"
                  value={imageSettings.height}
                  onChange={(e) => updateSetting('height', parseInt(e.target.value))}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                />
                <select
                  value={imageSettings.heightUnit}
                  onChange={(e) => updateSetting('heightUnit', e.target.value)}
                  className="bg-gray-800 text-white text-sm px-2 py-1 rounded"
                >
                  <option>px</option>
                  <option>%</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>

            {/* Roundness */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Roundness</label>
              <div className="flex items-center gap-2">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={imageSettings.imageRoundness}
                  onChange={(e) => updateSetting('imageRoundness', parseInt(e.target.value))}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                />
                <span className="text-xs text-gray-400">px</span>
              </div>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Opacity</label>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                <input
                  type="number"
                  value={imageSettings.opacity}
                  onChange={(e) => updateSetting('opacity', parseInt(e.target.value))}
                  className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>

            {/* Align */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Align</label>
              <div className="relative">
                <select
                  value={imageSettings.align}
                  onChange={(e) => updateSetting('align', e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded appearance-none"
                >
                  <option>Center</option>
                  <option>Left</option>
                  <option>Right</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};