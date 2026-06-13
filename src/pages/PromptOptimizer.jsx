import React, { useState, useEffect, useRef } from 'react';
import { agentSDK } from '@/agents';
import MessageBubble from '../components/agent/MessageBubble';
import { Send, Mic, MicOff, Loader2, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/entities/User';

export default function PromptOptimizer() {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        loadUser();
        loadConversations();
        initializeSpeechRecognition();
    }, []);

    useEffect(() => {
        if (currentConversation) {
            const unsubscribe = agentSDK.subscribeToConversation(currentConversation.id, (data) => {
                setMessages(data.messages);
            });
            return () => unsubscribe();
        }
    }, [currentConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadUser = async () => {
        const userData = await User.me();
        setUser(userData);
    };

    const loadConversations = async () => {
        const convos = await agentSDK.listConversations({ agent_name: 'prompt_optimizer' });
        setConversations(convos);
        
        if (convos.length > 0) {
            const latest = convos[0];
            setCurrentConversation(latest);
            setMessages(latest.messages || []);
        }
    };

    const initializeSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(prev => prev + ' ' + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const createNewConversation = async () => {
        const newConvo = await agentSDK.createConversation({
            agent_name: 'prompt_optimizer',
            metadata: {
                name: `Chat ${new Date().toLocaleString()}`,
                description: 'Prompt optimization session'
            }
        });
        setCurrentConversation(newConvo);
        setMessages([]);
        await loadConversations();
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || !currentConversation || isSending) return;

        setIsSending(true);
        try {
            await agentSDK.addMessage(currentConversation, {
                role: 'user',
                content: inputMessage.trim()
            });
            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100">
            <div className="max-w-7xl mx-auto p-4 h-screen flex gap-4">
                {/* Sidebar */}
                <div className="w-64 bg-white rounded-3xl shadow-lg p-4 flex flex-col">
                    <Button
                        onClick={createNewConversation}
                        className="mb-4 bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Chat
                    </Button>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {conversations.map(convo => (
                            <button
                                key={convo.id}
                                onClick={() => {
                                    setCurrentConversation(convo);
                                    setMessages(convo.messages || []);
                                }}
                                className={`w-full text-left p-3 rounded-2xl transition-all ${
                                    currentConversation?.id === convo.id
                                        ? 'bg-gradient-to-br from-purple-100 to-blue-100'
                                        : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="text-sm font-medium text-slate-800 truncate">
                                    {convo.metadata?.name || 'Conversation'}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {new Date(convo.created_date).toLocaleDateString()}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-lg flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Prompt Optimizer</h2>
                                <p className="text-sm text-slate-600">Transform ideas into stunning Veo3 prompts</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-md">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center mx-auto mb-4">
                                        <FileText className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Welcome to Prompt Optimizer!</h3>
                                    <p className="text-slate-600 mb-4">
                                        I can help you create amazing Veo3 prompts and rich character profiles. 
                                        Try asking me to:
                                    </p>
                                    <div className="text-left space-y-2 text-sm text-slate-600">
                                        <div>• "Optimize my product demo prompt"</div>
                                        <div>• "Help me create a cyberpunk character"</div>
                                        <div>• "Suggest visual styles for a nature documentary"</div>
                                        <div>• "Turn this idea into a full prompt: ..."</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <MessageBubble key={idx} message={msg} />
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-slate-200">
                        <div className="flex gap-3">
                            <button
                                onClick={toggleListening}
                                className={`p-3 rounded-2xl transition-all ${
                                    isListening
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                                disabled={!currentConversation}
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={currentConversation ? "Type your message or use the mic..." : "Create a new chat to start"}
                                className="flex-1 p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400 resize-none"
                                rows={2}
                                disabled={!currentConversation}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || !currentConversation || isSending}
                                className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}