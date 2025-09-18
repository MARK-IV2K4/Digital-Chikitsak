import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Settings } from 'lucide-react';

const VideoConsultation = ({ roomName, displayName, onEndCall }) => {
  const jitsiContainerRef = useRef(null);
  const [api, setApi] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      // Load Jitsi Meet API script
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initializeJitsi;
      document.head.appendChild(script);
    } else {
      initializeJitsi();
    }

    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, []);

  const initializeJitsi = () => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName || 'telemedicine-consultation',
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: displayName || 'Patient'
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableModeratorIndicator: true,
        startScreenSharing: false,
        enableEmailInStats: false,
        enableClosePage: false,
        toolbarButtons: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
        ]
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
        APP_NAME: 'ਚਿਕਿਤਸਕ Telemedicine',
        NATIVE_APP_NAME: 'Chikitsak',
        DEFAULT_BACKGROUND: '#1e3a8a',
        TOOLBAR_TIMEOUT: 4000,
        INITIAL_TOOLBAR_TIMEOUT: 20000,
        TOOLBAR_ALWAYS_VISIBLE: false,
        DEFAULT_REMOTE_DISPLAY_NAME: 'ਮਰੀਜ਼ (Patient)',
        DEFAULT_LOCAL_DISPLAY_NAME: 'ਤੁਸੀਂ (You)'
      }
    };

    const jitsiAPI = new window.JitsiMeetExternalAPI(domain, options);
    setApi(jitsiAPI);

    // Event listeners
    jitsiAPI.addEventListener('videoConferenceJoined', () => {
      setIsConnected(true);
      console.log('Joined video conference');
    });

    jitsiAPI.addEventListener('videoConferenceLeft', () => {
      setIsConnected(false);
      if (onEndCall) onEndCall();
    });

    jitsiAPI.addEventListener('audioMuteStatusChanged', (event) => {
      setIsAudioOn(!event.muted);
    });

    jitsiAPI.addEventListener('videoMuteStatusChanged', (event) => {
      setIsVideoOn(!event.muted);
    });

    jitsiAPI.addEventListener('readyToClose', () => {
      if (onEndCall) onEndCall();
    });
  };

  const toggleVideo = () => {
    if (api) {
      api.executeCommand('toggleVideo');
    }
  };

  const toggleAudio = () => {
    if (api) {
      api.executeCommand('toggleAudio');
    }
  };

  const endCall = () => {
    if (api) {
      api.executeCommand('hangup');
    }
  };

  return (
    <div className="h-screen bg-gray-900 relative">
      {/* Jitsi Meet Container */}
      <div ref={jitsiContainerRef} className="w-full h-full" />

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 text-center max-w-md mx-4"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">
              ਕਨੈਕਟ ਹੋ ਰਿਹਾ ਹੈ... (Connecting...)
            </h3>
            <p className="text-gray-600">
              ਕਿਰਪਾ ਕਰਕੇ ਇੰਤਜ਼ਾਰ ਕਰੋ (Please wait while we connect you)
            </p>
          </motion.div>
        </div>
      )}

      {/* Custom Control Bar (Optional - Jitsi has its own) */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-6 py-3 flex items-center gap-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition-colors ${
            isAudioOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
          }`}
          title={isAudioOn ? 'Mute Audio' : 'Unmute Audio'}
        >
          {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors ${
            isVideoOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
          }`}
          title={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={endCall}
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          title="End Call"
        >
          <PhoneOff size={20} />
        </button>
      </div>

      {/* Instructions for Rural Users */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg max-w-xs">
        <h4 className="font-semibold mb-2">ਹਦਾਇਤਾਂ (Instructions):</h4>
        <ul className="text-sm space-y-1">
          <li>• ਮਾਈਕ ਬਟਨ: ਆਵਾਜ਼ ਬੰਦ/ਚਾਲੂ (Mic: On/Off)</li>
          <li>• ਕੈਮਰਾ ਬਟਨ: ਵੀਡੀਓ ਬੰਦ/ਚਾਲੂ (Camera: On/Off)</li>
          <li>• ਲਾਲ ਬਟਨ: ਕਾਲ ਬੰਦ ਕਰੋ (Red: End Call)</li>
          <li>• ਚੈਟ ਲਈ ਸੱਜੇ ਪਾਸੇ ਦੇਖੋ (Check right for chat)</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoConsultation;