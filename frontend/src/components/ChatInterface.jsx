import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = ({ isFloating = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUrduDetected, setIsUrduDetected] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to detect Urdu text
  const detectUrdu = (text) => {
    // Check for Arabic/Persian/Urdu Unicode range (0x0600-0x06FF)
    const urduRegex = /[\u0600-\u06FF]/;
    return urduRegex.test(text);
  };

  // Function to apply RTL CSS when Urdu is detected
  const applyRTLCSS = (hasUrdu) => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      if (hasUrdu) {
        chatContainer.classList.add('rtl-mode');
        chatContainer.style.direction = 'rtl';
        chatContainer.style.textAlign = 'right';
      } else {
        chatContainer.classList.remove('rtl-mode');
        chatContainer.style.direction = 'ltr';
        chatContainer.style.textAlign = 'left';
      }
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputValue;

    if (!textToSend || !textToSend.trim()) return;

    // Check if Urdu is detected in the input
    const containsUrdu = detectUrdu(textToSend);
    setIsUrduDetected(containsUrdu);
    applyRTLCSS(containsUrdu);

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toISOString(),
      language: containsUrdu ? 'ur' : 'en'
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputValue(''); // Only clear input if we weren't passed a messageText
    setIsLoading(true);

    try {
      // Import the API service
      const apiService = (await import('../services/api.js')).default;

      // Send message to backend API using the service
      const response = await apiService.sendMessage(
        textToSend,
        localStorage.getItem('conversation_id') || null,
        messageText ? 'voice_transcript' : 'text', // Mark as voice if from voice input
        containsUrdu ? 'ur' : 'en',
        { language_preference: containsUrdu ? 'ur' : 'en' }
      );

      // Add bot response to messages
      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        language: response.language
      };

      // Check if bot response contains Urdu and update RTL if needed
      const botHasUrdu = detectUrdu(response.response);
      if (botHasUrdu) {
        setIsUrduDetected(true);
        applyRTLCSS(true);
      }

      setMessages(prev => [...prev, botMessage]);

      // Store conversation ID for future messages
      if (response.conversation_id) {
        localStorage.setItem('conversation_id', response.conversation_id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your request.',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        language: 'en'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render individual message
  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const containsUrdu = detectUrdu(message.text);

    // Apply RTL if message contains Urdu
    const messageStyle = {
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      backgroundColor: isUser ? '#DCF8C6' : '#F0F0F0',
      padding: '10px 15px',
      borderRadius: '10px',
      marginBottom: '10px',
      maxWidth: '70%',
      textAlign: containsUrdu ? 'right' : 'left',
      direction: containsUrdu ? 'rtl' : 'ltr',
      unicodeBidi: 'plaintext',
      color: 'black' // Ensure text color is black
    };

    return (
      <div
        key={message.id}
        style={messageStyle}
        className={`message ${isUser ? 'user-message' : 'bot-message'} ${containsUrdu ? 'urdu-text' : ''}`}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '5px', color: 'black' }}>
          {isUser ? 'You' : 'Assistant'}
        </div>
        <div style={{ color: 'black' }}>{message.text}</div>
        <div style={{ fontSize: '0.8em', color: '#333', marginTop: '5px' }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    );
  };

  // Handle voice input
  const handleVoiceInput = async (audioData) => {
    setIsLoading(true);

    try {
      // Simulate voice-to-text conversion
      // In a real implementation, this would send the audio to a speech-to-text service
      // For demo purposes, we'll simulate a text conversion
      const simulatedText = "This is a simulated voice input. In a real implementation, this would be the actual transcribed text from your voice.";

      // Send the transcribed text as a message
      handleSendMessage(simulatedText);
    } catch (error) {
      console.error('Error processing voice input:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your voice input.',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        language: 'en'
      }]);
      setIsLoading(false);
    }
  };

  // Import VoiceInput component inline for this example
  const VoiceInputComponent = () => {
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
          handleVoiceInput({
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
        alert('Microphone access denied. Please allow microphone access to use voice input.');
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

  return (
    <div
      id="chat-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isFloating ? '100%' : '100vh',
        padding: isFloating ? '15px' : '20px',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        color: 'black' // Set default text color to black
      }}
    >
      {!isFloating && (
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: 'black' }}>AI Chatbot</h1>
      )}

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '15px',
          padding: '8px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
          maxHeight: isFloating ? 'calc(100% - 100px)' : 'none'
        }}
      >
        {messages.length > 0 ? (
          messages.map(renderMessage)
        ) : (
          <div style={{ textAlign: 'center', color: '#333', fontStyle: 'italic', padding: '20px' }}>
            Start a conversation...
          </div>
        )}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: '#F0F0F0',
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '8px',
            color: 'black'
          }}>
            Assistant is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);

            // Check for Urdu in real-time and apply RTL if detected
            const containsUrdu = detectUrdu(e.target.value);
            if (containsUrdu !== isUrduDetected) {
              setIsUrduDetected(containsUrdu);
              applyRTLCSS(containsUrdu);
            }
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Supports English and Urdu)"
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            minHeight: '50px',
            maxHeight: '100px',
            resize: 'vertical',
            fontSize: '14px',
            color: 'black',
            backgroundColor: 'white'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '8px 12px',
              backgroundColor: isLoading || !inputValue.trim() ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isLoading ? '...' : 'Send'}
          </button>

          {/* Voice Input Button */}
          <VoiceInputComponent />
        </div>
      </div>

      {/* Add RTL-specific CSS */}
      <style jsx>{`
        .urdu-text {
          font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Urdu Typesetting', serif;
        }

        .rtl-mode {
          direction: rtl;
          text-align: right;
        }

        #chat-container {
          transition: direction 0.3s ease;
          color: black;
        }

        .message {
          color: black;
        }

        .user-message {
          color: black;
        }

        .bot-message {
          color: black;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;