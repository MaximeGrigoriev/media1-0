import React from 'react';
import Lottie from 'lottie-react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { Copy, Trash2 } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

interface PhoneEmulatorProps {
  selectedComponent: any;
  onSelectComponent: (component: any) => void;
  uploadedImage?: string;
  lottieData?: any;
  riveData?: ArrayBuffer;
  mediaType?: string;
  audioFile?: File;
  showAvatar?: boolean;
  avatarImage?: string;
  customText?: string;
  playerColors?: {
    buttonColor: string;
    buttonIconColor: string;
    audioColor: string;
    audioActiveColor: string;
  };
}

export const PhoneEmulator: React.FC<PhoneEmulatorProps> = ({ 
  selectedComponent, 
  onSelectComponent,
  uploadedImage,
  lottieData,
  riveData,
  mediaType = 'Image / Animation',
  audioFile,
  showAvatar = true,
  avatarImage,
  customText = '',
  playerColors = {
    buttonColor: '#10b981',
    buttonIconColor: '#ffffff',
    audioColor: '#d1d5db',
    audioActiveColor: '#10b981'
  }
}) => {
  const { rive, RiveComponent } = useRive({
    buffer: riveData,
    autoplay: true,
    stateMachines: "State Machine 1",
  }, [riveData]);

  return (
    <div className="flex-1 bg-gray-800 flex items-center justify-center p-8">
      {/* iPhone Frame */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[340px] h-[738px] bg-black rounded-[49px] p-2">
          <div className="w-full h-full bg-white rounded-[42px] overflow-hidden relative">
            {/* Status Bar */}
            <div className="h-10 bg-white flex items-center justify-between px-5 text-black text-sm font-medium">
              <span>9:41</span>
              <div className="w-14 h-5 bg-black rounded-full"></div>
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
                <div className="w-5 h-3 border border-black rounded-sm">
                  <div className="w-full h-full bg-black rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="pt-4">
              <h1 className="text-lg font-semibold text-center mb-5">New Screen</h1>
              
              {/* Red indicator line */}
              <div className="w-8 h-1 bg-red-500 mb-4 ml-4"></div>

              {/* Media Component */}
              <div className="px-3">
                <div
                className={`relative group cursor-pointer ${
                  selectedComponent?.type === 'image' || selectedComponent?.type === 'audio' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onSelectComponent({ 
                  type: mediaType === 'Audio' ? 'audio' : 'image', 
                  id: mediaType === 'Audio' ? 'audio-1' : 'image-1' 
                })}
                >
                {/* Component Header */}
                <div className="bg-black text-white px-3 py-2 rounded-t text-sm flex items-center justify-between">
                  <span>{mediaType === 'Audio' ? 'Audio' : 'Image'}</span>
                  <div className="flex gap-1">
                    <Copy className="w-3 h-3" />
                    <Trash2 className="w-3 h-3" />
                  </div>
                </div>
                
                {/* Media Content */}
                {mediaType === 'Audio' ? (
                  <div className="w-full p-5 bg-gray-50 border-2 border-dashed border-gray-300">
                    {audioFile ? (
                      <AudioPlayer 
                        audioFile={audioFile}
                        title={customText || audioFile.name.replace(/\.[^/.]+$/, "")}
                        showAvatar={showAvatar}
                        coverImage={avatarImage}
                        playerColors={playerColors}
                      />
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        <div className="w-10 h-10 mx-auto mb-2 bg-gray-200 rounded"></div>
                        <span className="text-sm">No audio selected</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="w-full h-56 border-2 border-dashed border-gray-300 bg-white flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundImage: (uploadedImage || lottieData || riveData) ? 'none' : `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='checkerboard' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3crect fill='%23f0f0f0' x='0' width='10' height='10' y='0'/%3e%3crect fill='%23f0f0f0' x='10' width='10' height='10' y='10'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23checkerboard)' /%3e%3c/svg%3e")`,
                    }}
                  >
                    {riveData ? (
                      <div className="w-full h-full">
                        <RiveComponent />
                      </div>
                    ) : lottieData ? (
                      <Lottie 
                        animationData={lottieData} 
                        className="w-full h-full"
                        loop={true}
                        autoplay={true}
                      />
                    ) : uploadedImage ? (
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded content" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 bg-gray-200 rounded"></div>
                        <span className="text-sm">No media selected</span>
                      </div>
                    )}
                  </div>
                )}
                </div>
              </div>

              {/* Bottom Button */}
              <div className="mt-auto pt-8 px-4">
                <button className="w-full bg-black text-white py-4 rounded-full text-base font-medium">
                  Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};