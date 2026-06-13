import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SpeechInput({ value, onChange, placeholder, className = '', multiline = false }) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
            setIsListening(true);
        };

        recognitionInstance.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = value || '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += (finalTranscript ? ' ' : '') + transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            onChange(finalTranscript || interimTranscript);
        };

        recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        recognitionInstance.start();
        setRecognition(recognitionInstance);
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    };

    const InputComponent = multiline ? 'textarea' : 'input';

    return (
        <div className="relative">
            <InputComponent
                type={multiline ? undefined : "text"}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={multiline ? 4 : undefined}
                className={`w-full px-4 py-3 pr-12 bg-white rounded-2xl border ${
                    isListening ? 'border-red-400 ring-2 ring-red-200' : 'border-purple-200'
                } focus:outline-none focus:border-purple-400 ${multiline ? 'resize-none' : ''} ${className}`}
            />
            <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-3 top-3 p-2 rounded-full transition-all ${
                    isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
                title={isListening ? 'Stop recording' : 'Start speech-to-text'}
            >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
        </div>
    );
}