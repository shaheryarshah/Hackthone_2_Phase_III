import React, { useState, useRef, useEffect } from 'react';

const VoiceInput = ({ onAudioCaptured, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaStreamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request access to microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create media recorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        // Combine audio chunks into a blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

        // Create a temporary URL for the audio
        const audioUrl = URL.createObjectURL(audioBlob);

        // Pass the audio data to the parent component
        onAudioCaptured({
          blob: audioBlob,
          url: audioUrl,
          chunks: audioChunks
        });
      };

      recorder.start();
      setIsRecording(true);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError && onError('Microphone access denied. Please allow microphone access to use voice input.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={toggleRecording}
        style={{
          padding: '10px 15px',
          backgroundColor: isRecording ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '18px'
        }}
        title={isRecording ? "Stop Recording" : "Start Recording"}
      >
        {isRecording ? '●' : '●'}
      </button>

      {isRecording && (
        <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
          REC {formatTime(recordingTime)}
        </span>
      )}

      {isRecording && (
        <span style={{ fontSize: '12px', color: '#666' }}>
          Tap to stop
        </span>
      )}
    </div>
  );
};

export default VoiceInput;