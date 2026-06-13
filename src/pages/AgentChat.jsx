
import React, { useState, useEffect, useRef } from 'react';
import { agentSDK } from '@/agents';
import { Send, Mic, MicOff, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MessageBubble from '../components/agent/MessageBubble';
import { consumeCredits, checkCredits, CREDIT_COSTS } from '../components/utils/credits';

export default function AgentChat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [listening, setListening] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [agentName, setAgentName] = useState('');
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const agent = urlParams.get('agent');
        const conversationId = urlParams.get('conversation');

        if (!agent || !conversationId) {
            alert('Invalid agent chat URL');
            window.location.href = createPageUrl('AgentHub');
            return;
        }

        setAgentName(agent);
        loadConversation(conversationId);

        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(prev => prev + ' ' + transcript);
            };

            recognition.onerror = () => {
                setListening(false);
            };

            recognition.onend = () => {
                setListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const loadConversation = async (conversationId) => {
        try {
            const convo = await agentSDK.getConversation(conversationId);
            setConversation(convo);
            setMessages(convo.messages || []);

            // Subscribe to updates
            agentSDK.subscribeToConversation(conversationId, (data) => {
                setMessages(data.messages || []);
            });
        } catch (error) {
            console.error('Error loading conversation:', error);
            alert('Failed to load conversation');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputMessage.trim() || sending || !conversation) return;

        // Check credits
        const hasCredits = await checkCredits(CREDIT_COSTS.agent_message);
        if (!hasCredits) {
            alert(`You need ${CREDIT_COSTS.agent_message} credits to send a message. Please purchase more credits.`);
            return;
        }

        setSending(true);
        try {
            await consumeCredits('agent_message', CREDIT_COSTS.agent_message);

            await agentSDK.addMessage(conversation, {
                role: 'user',
                content: inputMessage
            });

            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message: ' + error.message);
        } finally {
            setSending(false);
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition not supported in this browser');
            return;
        }

        if (listening) {
            recognitionRef.current.stop();
            setListening(false);
        } else {
            recognitionRef.current.start();
            setListening(true);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const agentTitle = agentName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link to={createPageUrl('AgentHub')}>
                            <button className="text-white hover:text-white/80 transition-all">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-white">{agentTitle}</h1>
                            <p className="text-sm text-white/70">AI Assistant</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">👋</div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                Start a conversation with {agentTitle}
                            </h2>
                            <p className="text-slate-600">
                                Ask questions, get suggestions, or request help with your Veo3 projects
                            </p>
                        </div>
                    ) : (
                        messages.map((message, idx) => (
                            <MessageBubble key={idx} message={message} />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-200 shadow-lg">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-end gap-3">
                        <button
                            onClick={toggleListening}
                            className={`p-3 rounded-2xl transition-all ${
                                listening
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title={listening ? 'Stop listening' : 'Start voice input'}
                        >
                            {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400 resize-none"
                            rows={1}
                            disabled={sending}
                        />

                        <button
                            onClick={handleSend}
                            disabled={!inputMessage.trim() || sending}
                            className="px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-medium transition-all flex items-center gap-2"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send
                                </>
                            )}
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 text-center">
                        Each message costs {CREDIT_COSTS.agent_message} credits
                    </div>
                </div>
            </div>
        </div>
    );
}
