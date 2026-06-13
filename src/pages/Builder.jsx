import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PromptPreview from '../components/builder/PromptPreview';
import SpeechInput from '../components/builder/SpeechInput';

import { base44 } from '@/api/base44Client';
import { SavedPrompt } from '@/entities/SavedPrompt';
import { Template } from '@/entities/Template';
import { Character } from '@/entities/Character';
import { Sparkles, Save, Loader, Zap, Plus, Trash2 } from 'lucide-react';

import { consumeCredits, checkCredits, CREDIT_COSTS } from '../components/utils/credits';

const scenes = [
  "A train conductor checking his pocket watch on a misty platform.",
  "A chef meticulously plating a complex dish in a high-end kitchen.",
  "An astronaut floating silently in the ISS, looking down at Earth.",
  "A librarian stamping books in a dusty, sunlit library.",
  "A group of friends laughing around a campfire on a beach.",
  "A detective studying a clue board in a dimly lit office.",
  "A street artist spray-painting a vibrant mural on a brick wall.",
  "A child flying a kite in a vast, green field on a windy day.",
  "A friendly yeti telling jokes while building a snowman in the mountains.",
  "A 3D animated map of France with the Eiffel Tower slowly emerging from Paris.",
  "Ancient pyramids materializing on an Egyptian desert map with golden sunrise.",
  "A digital map of Japan with Mount Fuji and cherry blossoms appearing gracefully."
];

const compositions = [
  "Wide aerial tracking shot",
  "Extreme close-up",
  "Medium shot",
  "Over-the-shoulder shot",
  "Point-of-view (POV) shot",
  "Low angle shot",
  "Dutch angle shot"
];

const visualStyles = [
  "Cinematic",
  "Documentary",
  "Vintage Film (16mm)",
  "Hyper-realistic",
  "Anime",
  "Film Noir",
  "Technicolor"
];

const lightingStyles = [
  "Natural lighting",
  "Golden hour",
  "Studio lighting",
  "Neon lighting",
  "High-contrast",
  "Moonlight",
  "Backlit"
];

const backgrounds = [
  "Indoor setting",
  "Bustling city street",
  "Misty forest",
  "Modern minimalist apartment",
  "Futuristic sci-fi corridor",
  "Crowded marketplace",
  "Serene mountain landscape"
];

const audioCues = [
  "Ambient sounds",
  "Upbeat jazz music",
  "Tense string orchestra",
  "Sound of gentle rain",
  "Distant city sirens",
  "Chirping birds",
  "Suspenseful silence"
];

const dialogues = [
  "You know what they say about first impressions, but I've learned to never judge too quickly.",
  "It wasn't about the destination. It was about the journey we never took.",
  "Sometimes, the smallest key can unlock the biggest door.",
  "Is this what we were fighting for? I can't remember anymore.",
  "I've seen things you people wouldn't believe.",
  "Just act natural. They can't know we're here.",
  "Why did the yeti cross the road? To get to the ice cream shop!",
  "Look at this beautiful country unfold before our eyes like a living story."
];

const colorPalettes = [
    { name: "None", colors: [] },
    { name: "Lavender Dream", colors: ["#E6E6FA", "#DDA0DD", "#9370DB"] },
    { name: "Mint Fresh", colors: ["#F0FFF0", "#98FB98", "#00FA9A"] },
    { name: "Baby Blue Sky", colors: ["#E0F6FF", "#87CEEB", "#4169E1"] },
    { name: "Peachy Soft", colors: ["#FFE5CC", "#FFCC99", "#FF9966"] },
    { name: "Rose Quartz", colors: ["#FFE4E6", "#FFC0CB", "#FF69B4"] },
    { name: "Sage Green", colors: ["#F0F8E8", "#C8E6C9", "#81C784"] },
];

const cameraMovements = [
    "Precision dolly-in from 2.5m to 1.5m over 5 seconds",
    "Slow 180-degree pan from left to right",
    "Jib shot moving up and over the subject",
    "Handheld tracking shot following a character running",
    "Static tripod shot with no movement",
    "Fast zoom-out from a character's eyes to a wide shot"
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ClaySection = ({ icon, title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-3 px-2">{icon} {title}</h3>
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.08)] border border-purple-100/50">
            {children}
        </div>
    </div>
);

const ClayButton = ({ onClick, children, variant = "primary", size = "default", className = "", ...props }) => {
    const baseClasses = "font-medium transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50";
    
    const variants = {
        primary: "bg-gradient-to-br from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500 text-purple-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_12px_rgba(147,112,219,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_16px_rgba(147,112,219,0.4)] focus:ring-purple-300",
        secondary: "bg-gradient-to-br from-mint-200 to-mint-300 hover:from-mint-300 hover:to-mint-400 text-mint-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_12px_rgba(152,251,152,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_16px_rgba(152,251,152,0.4)] focus:ring-mint-300",
        danger: "bg-gradient-to-br from-rose-300 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-rose-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_12px_rgba(251,113,133,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_16px_rgba(251,113,133,0.4)] focus:ring-rose-300"
    };
    
    const sizes = {
        sm: "px-4 py-2 text-sm rounded-2xl",
        default: "px-6 py-3 text-base rounded-3xl",
        lg: "px-8 py-4 text-lg rounded-3xl"
    };
    
    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const ClayInput = ({ value, onChange, placeholder, className = "", ...props }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 shadow-[inset_0_3px_6px_rgba(0,0,0,0.07)] border border-blue-100/50 focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.1),0_0_0_3px_rgba(135,206,235,0.3)] focus:outline-none focus:border-blue-200 transition-all duration-300 resize-none text-slate-700 placeholder:text-slate-400 ${className}`}
        {...props}
    />
);

const ClaySelect = ({ value, onValueChange, children, placeholder }) => (
    <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 h-auto shadow-[inset_0_3px_6px_rgba(0,0,0,0.07)] border border-green-100/50 focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.1),0_0_0_3px_rgba(152,251,152,0.3)] focus:outline-none focus:border-green-200 transition-all duration-300">
            <SelectValue placeholder={placeholder} className="text-slate-700" />
        </SelectTrigger>
        <SelectContent className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-green-100/50">
            {children}
        </SelectContent>
    </Select>
);

// New component for saving prompts
const SavePromptModal = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSaveClick = () => {
        if (title.trim()) {
            onSave({ title, description });
        } else {
            alert('Title is required to save the prompt.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.1)] border border-purple-100/50 w-full max-w-md">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Save Your Prompt</h3>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-2">Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter prompt title"
                        className="w-full bg-gradient-to-br from-white to-blue-50 rounded-2xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-blue-100/50 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_0_0_3px_rgba(135,206,235,0.3)] focus:outline-none focus:border-blue-200 transition-all duration-300 text-slate-700 placeholder:text-slate-400"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 mb-2">Description (Optional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a brief description"
                        rows={3}
                        className="w-full bg-gradient-to-br from-white to-blue-50 rounded-2xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-blue-100/50 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_0_0_3px_rgba(135,206,235,0.3)] focus:outline-none focus:border-blue-200 transition-all duration-300 resize-y text-slate-700 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <ClayButton onClick={onCancel} variant="secondary">Cancel</ClayButton>
                    <ClayButton onClick={handleSaveClick}>Save Prompt</ClayButton>
                </div>
            </div>
        </div>
    );
};


export default function Builder() {
    const initialState = useMemo(() => ({
        scene_description: '',
        shot_composition: '',
        camera_movement: '',
        visual_style: '',
        custom_visual_style: '',
        lighting: '',
        custom_lighting: '',
        environment: '',
        custom_environment: '',
        audio_cue: '',
        custom_audio_cue: '',
        dialogue: '',
        color_palette: JSON.stringify(colorPalettes[0]) // Default to "None"
    }), []);

    const [formState, setFormState] = useState(initialState);
    // New state variables
    const [enhancing, setEnhancing] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState('');
    const [showOptimizerChat, setShowOptimizerChat] = useState(false);
    const [scenes, setScenes] = useState([formState]);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

    const loadInitialData = useCallback(async () => {
        // Load from URL params if present
        const urlParams = new URLSearchParams(window.location.search);
        const promptId = urlParams.get('prompt');
        const templateId = urlParams.get('template');
        const storyboardId = urlParams.get('storyboard');
        const sceneIdx = urlParams.get('scene');

        if (storyboardId) {
            const storyboard = await SavedPrompt.get(storyboardId);
            if (storyboard && storyboard.prompt_data.scenes) {
                if (sceneIdx !== null) {
                    // Edit existing scene
                    const sceneIndex = parseInt(sceneIdx);
                    setScenes(storyboard.prompt_data.scenes);
                    setCurrentSceneIndex(sceneIndex);
                    setFormState({ ...initialState, ...storyboard.prompt_data.scenes[sceneIndex].prompt_data });
                } else {
                    // Add new scene
                    setScenes(storyboard.prompt_data.scenes);
                }
            }
        } else if (promptId) {
            const prompt = await SavedPrompt.get(promptId);
            if (prompt) {
                setFormState(prev => ({ ...prev, ...prompt.prompt_data }));
            }
        } else if (templateId) {
            const template = await Template.get(templateId);
            if (template) {
                const loadedTemplateData = { ...initialState, ...template.prompt_data };
                if (loadedTemplateData.color_palette && typeof loadedTemplateData.color_palette === 'object') {
                    loadedTemplateData.color_palette = JSON.stringify(loadedTemplateData.color_palette);
                }
                setFormState(prev => ({ ...prev, ...loadedTemplateData }));
                await Template.update(templateId, { usage_count: (template.usage_count || 0) + 1 });
            }
        }

        // Load characters
        const user = await base44.auth.me();
        if (user && user.email) {
            const userCharacters = await Character.filter({ created_by: user.email });
            setCharacters(userCharacters);
        }
    }, [initialState]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handleChange = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleCharacterSelect = (characterId) => {
        setSelectedCharacter(characterId); // Update selectedCharacter state
        if (characterId === 'None' || !characterId) { // If "None" is selected or characterId is null/undefined
            // This might require a more sophisticated approach if the character was part of the original scene_description
            // For now, we'll clear/reset, but a real app might need to parse and remove.
            setFormState(prev => ({ ...prev, scene_description: '' })); 
            return;
        }

        const character = characters.find(c => c.id === characterId);
        if (character) {
            // Combine character details with existing scene description
            const existingScene = formState.scene_description;
            let newScene = `${character.name || 'A character'} - ${character.visual_traits || 'visually distinct'}`;
            if (character.demographics) {
                newScene += `, ${character.demographics}`;
            }
            // Append existing scene description if it doesn't already contain character info
            if (existingScene && !existingScene.includes(character.name || 'A character')) {
                newScene += `. ${existingScene}`;
            }
            setFormState(prev => ({ ...prev, scene_description: newScene }));
        }
    };

    const addScene = () => {
        setScenes([...scenes, { ...initialState }]);
        setCurrentSceneIndex(scenes.length);
    };

    const removeScene = (index) => {
        if (scenes.length === 1) return;
        const newScenes = scenes.filter((_, i) => i !== index);
        setScenes(newScenes);
        setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1));
    };

    const saveToStoryboard = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const storyboardId = urlParams.get('storyboard');
        
        if (!storyboardId) return;

        const updatedScenes = [...scenes];
        updatedScenes[currentSceneIndex] = {
            title: `Scene ${currentSceneIndex + 1}`,
            prompt_data: generatePromptJson()
        };

        await SavedPrompt.update(storyboardId, {
            prompt_data: { scenes: updatedScenes }
        });

        alert('Scene saved to storyboard!');
        window.location.href = '/Storyboard';
    };

    const enhancePrompt = async () => {
        // Check credits first
        const hasCredits = await checkCredits(CREDIT_COSTS.ai_enhance);
        if (!hasCredits) {
            alert(`You need ${CREDIT_COSTS.ai_enhance} credits to use AI Enhancement. Please purchase more credits.`);
            return;
        }

        setEnhancing(true);
        try {
            // Consume credits before enhancement
            await consumeCredits('ai_enhance', CREDIT_COSTS.ai_enhance);

            const currentPromptData = generatePromptJson();
            const { color_palette, ...promptDataForLLM } = currentPromptData;
            
            const currentPromptJsonString = JSON.stringify(promptDataForLLM, null, 2);
            
            const enhancedData = await base44.integrations.Core.InvokeLLM({
                prompt: `You are an expert in creating prompts for Google's Veo3 AI video generation.
                
Here's the current prompt:
${currentPromptJsonString}

Enhance this prompt to be more detailed and effective. Make the descriptions more vivid and specific.
Return the enhanced version with the same JSON structure.

Rules:
- Keep the same JSON structure.
- Only enhance fields that are present in the provided JSON. Do not add new fields unless they are already in the base structure.
- Make descriptions more detailed and cinematic.
- Add specific details that will improve video quality.
- Don't change the core intent, just enhance it.
- If a field is empty in the input, it should remain empty in the output.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        scene_description: { type: "string" },
                        shot_composition: { type: "string" },
                        camera_movement: { type: "string" },
                        visual_style: { type: "string" },
                        lighting: { type: "string" },
                        environment: { type: "string" },
                        audio_cue: { type: "string" },
                        dialogue: { type: "string" }
                    }
                }
            });

            // Update formState with enhanced data, clearing custom fields
            setFormState(prev => ({
                ...prev,
                ...enhancedData,
                custom_visual_style: '',
                custom_lighting: '',
                custom_environment: '',
                custom_audio_cue: ''
            }));
        } catch (error) {
            console.error("Error enhancing prompt:", error);
            alert("Failed to enhance prompt: " + error.message);
        } finally {
            setEnhancing(false);
        }
    };

    const handleSave = async (saveData) => {
        try {
            await SavedPrompt.create({
                ...saveData, // Contains title and description
                prompt_data: generatePromptJson() // The structured prompt data
            });
            alert('Prompt saved successfully!');
        } catch (error) {
            console.error("Error saving prompt:", error);
            alert("Failed to save prompt. Please try again.");
        } finally {
            setShowSaveModal(false);
        }
    };

    const handleClear = () => {
        setFormState(initialState);
        setSelectedCharacter(''); // Clear selected character on clear
    };

    const randomizeAll = () => {
        setFormState({
            scene_description: getRandomItem(scenes),
            shot_composition: getRandomItem(compositions),
            camera_movement: getRandomItem(cameraMovements),
            visual_style: getRandomItem(visualStyles),
            custom_visual_style: '',
            lighting: getRandomItem(lightingStyles),
            custom_lighting: '',
            environment: getRandomItem(backgrounds),
            custom_environment: '',
            audio_cue: getRandomItem(audioCues),
            custom_audio_cue: '',
            dialogue: getRandomItem(dialogues),
            color_palette: JSON.stringify(getRandomItem(colorPalettes.slice(1))) // Randomize from actual palettes, not "None"
        });
        setSelectedCharacter(''); // Clear selected character on randomize all
    };
    
    const randomizeScene = () => {
        handleChange('scene_description', getRandomItem(scenes));
        setSelectedCharacter(''); // Clear selected character when randomizing scene
    };

    const randomizeBackground = () => {
        handleChange('environment', getRandomItem(backgrounds));
    };

    const randomizeDialogue = () => {
        handleChange('dialogue', getRandomItem(dialogues));
    };

    const generatePromptJson = () => {
        const selectedPalette = JSON.parse(formState.color_palette);
        const promptData = {
            scene_description: formState.scene_description || undefined,
            shot_composition: formState.shot_composition || undefined,
            camera_movement: formState.camera_movement || undefined,
            visual_style: formState.custom_visual_style || formState.visual_style || undefined,
            lighting: formState.custom_lighting || formState.lighting || undefined,
            environment: formState.custom_environment || formState.environment || undefined,
            audio_cue: formState.custom_audio_cue || formState.audio_cue || undefined,
            dialogue: formState.dialogue || undefined,
        };
        
        if (selectedPalette.name !== "None" && selectedPalette.colors.length > 0) {
            promptData.color_palette = {
                name: selectedPalette.name,
                colors: selectedPalette.colors
            };
        }

        // Remove undefined keys for a cleaner output
        Object.keys(promptData).forEach(key => {
            if (promptData[key] === undefined || promptData[key] === '') { // Also remove empty strings
                delete promptData[key];
            }
        });

        return promptData;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Panel */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.1)] border border-purple-100/50">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-3">
                                    🚀 Need Veo 3 Prompt Inspiration?
                                </h2>
                                
                                {/* New AI Enhancement & Save Buttons */}
                                <div className="flex gap-3 mb-4">
                                    <ClayButton
                                        onClick={enhancePrompt}
                                        disabled={enhancing}
                                        className="flex-1 flex items-center justify-center gap-2"
                                    >
                                        {enhancing ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Enhancing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                AI Enhance
                                            </>
                                        )}
                                    </ClayButton>
                                    <ClayButton
                                        onClick={() => setShowOptimizerChat(true)}
                                        variant="secondary"
                                        className="flex-1 flex items-center justify-center gap-2"
                                    >
                                        <Zap className="w-5 h-5" />
                                        Optimize
                                    </ClayButton>
                                    <ClayButton
                                        onClick={() => setShowSaveModal(true)}
                                        variant="secondary"
                                        className="flex-1 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save
                                    </ClayButton>
                                </div>

                                <ClayButton onClick={randomizeAll} size="lg" className="w-full mb-4">
                                    🎲 Complete Random Veo 3 Prompt
                                </ClayButton>
                                <p className="text-slate-600 mb-4">Or randomize individual Veo 3 elements:</p>
                                <div className="flex gap-3 justify-center flex-wrap">
                                    <ClayButton onClick={randomizeScene} size="sm" variant="secondary">🎬 Scene</ClayButton>
                                    <ClayButton onClick={randomizeBackground} size="sm" variant="secondary">🖼️ Background</ClayButton>
                                    <ClayButton onClick={randomizeDialogue} size="sm" variant="secondary">💬 Dialogue</ClayButton>
                                </div>
                            </div>
                        </div>

                        {/* Character Selection */}
                        {characters.length > 0 && (
                            <ClaySection icon="👥" title="Use Character">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Insert Character from Library</label>
                                    <ClaySelect 
                                        value={selectedCharacter}
                                        onValueChange={handleCharacterSelect}
                                        placeholder="Select a character..."
                                    >
                                        <SelectItem value="None">None</SelectItem>
                                        {characters.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </ClaySelect>
                                </div>
                            </ClaySection>
                        )}

                        {/* Multi-Scene Management */}
                        {new URLSearchParams(window.location.search).get('storyboard') && (
                            <ClaySection icon="🎞️" title="Multi-Scene Management">
                                <div className="space-y-4">
                                    <div className="flex gap-2 items-center">
                                        {scenes.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentSceneIndex(idx)}
                                                className={`px-4 py-2 rounded-2xl font-medium ${
                                                    currentSceneIndex === idx
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white text-slate-700'
                                                }`}
                                            >
                                                Scene {idx + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={addScene}
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                        {scenes.length > 1 && (
                                            <button
                                                onClick={() => removeScene(currentSceneIndex)}
                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <ClayButton onClick={saveToStoryboard} className="w-full">
                                        Save to Storyboard
                                    </ClayButton>
                                </div>
                            </ClaySection>
                        )}

                        {/* Scene Description */}
                        <ClaySection icon="🎬" title="Scene Description">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-3">Describe Your Scene</label>
                                <SpeechInput
                                    value={formState.scene_description}
                                    onChange={(v) => handleChange('scene_description', v)}
                                    placeholder="Enter scene description..."
                                    multiline={true}
                                />
                            </div>
                        </ClaySection>

                        {/* Shot Composition */}
                        <ClaySection icon="📸" title="Shot Composition">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-3">Composition</label>
                                <ClaySelect 
                                    value={formState.shot_composition}
                                    onValueChange={(v) => handleChange('shot_composition', v)}
                                    placeholder="Select composition..."
                                >
                                    {compositions.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </ClaySelect>
                            </div>
                        </ClaySection>

                        {/* Camera Movement */}
                        <ClaySection icon="🎥" title="Camera Movement">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-3">Camera Motion</label>
                                <SpeechInput
                                    value={formState.camera_movement}
                                    onChange={(v) => handleChange('camera_movement', v)}
                                    placeholder="Enter camera movement..."
                                    multiline={true}
                                />
                            </div>
                        </ClaySection>

                        {/* Visual Style */}
                        <ClaySection icon="🎨" title="Visual Style">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Style</label>
                                    <ClaySelect 
                                        value={formState.visual_style}
                                        onValueChange={(v) => handleChange('visual_style', v)}
                                        placeholder="Select visual style..."
                                    >
                                        {visualStyles.map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </ClaySelect>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Or enter your own visual style...</label>
                                    <SpeechInput
                                        value={formState.custom_visual_style}
                                        onChange={(v) => handleChange('custom_visual_style', v)}
                                        placeholder="Custom visual style..."
                                        multiline={true}
                                    />
                                </div>
                            </div>
                        </ClaySection>

                        {/* Lighting */}
                        <ClaySection icon="💡" title="Lighting">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Lighting Style</label>
                                    <ClaySelect 
                                        value={formState.lighting}
                                        onValueChange={(v) => handleChange('lighting', v)}
                                        placeholder="Select lighting..."
                                    >
                                        {lightingStyles.map(l => (
                                            <SelectItem key={l} value={l}>{l}</SelectItem>
                                        ))}
                                    </ClaySelect>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Or enter your own lighting style...</label>
                                    <SpeechInput
                                        value={formState.custom_lighting}
                                        onChange={(v) => handleChange('custom_lighting', v)}
                                        placeholder="Custom lighting..."
                                        multiline={true}
                                    />
                                </div>
                            </div>
                        </ClaySection>

                        {/* Environment */}
                        <ClaySection icon="🖼️" title="Environment">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Background Setting</label>
                                    <ClaySelect 
                                        value={formState.environment}
                                        onValueChange={(v) => handleChange('environment', v)}
                                        placeholder="Select environment..."
                                    >
                                        {backgrounds.map(b => (
                                            <SelectItem key={b} value={b}>{b}</SelectItem>
                                        ))}
                                    </ClaySelect>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Or enter your own background setting...</label>
                                    <SpeechInput
                                        value={formState.custom_environment}
                                        onChange={(v) => handleChange('custom_environment', v)}
                                        placeholder="Custom environment..."
                                        multiline={true}
                                    />
                                </div>
                            </div>
                        </ClaySection>

                        {/* Audio */}
                        <ClaySection icon="🔊" title="Audio">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Audio Description</label>
                                    <ClaySelect 
                                        value={formState.audio_cue}
                                        onValueChange={(v) => handleChange('audio_cue', v)}
                                        placeholder="Select audio..."
                                    >
                                        {audioCues.map(a => (
                                            <SelectItem key={a} value={a}>{a}</SelectItem>
                                        ))}
                                    </ClaySelect>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-3">Or enter your own audio description...</label>
                                    <SpeechInput
                                        value={formState.custom_audio_cue}
                                        onChange={(v) => handleChange('custom_audio_cue', v)}
                                        placeholder="Custom audio..."
                                        multiline={true}
                                    />
                                </div>
                            </div>
                        </ClaySection>

                        {/* Dialogue */}
                        <ClaySection icon="💬" title="Dialogue">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-3">Spoken Text (optional)</label>
                                <SpeechInput
                                    value={formState.dialogue}
                                    onChange={(v) => handleChange('dialogue', v)}
                                    placeholder="Enter dialogue..."
                                    multiline={true}
                                />
                            </div>
                        </ClaySection>

                        {/* Color Palette */}
                        <ClaySection icon="🌈" title="Color Palette">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-3">Choose Color Scheme (Optional)</label>
                                <ClaySelect 
                                    value={formState.color_palette}
                                    onValueChange={(v) => handleChange('color_palette', v)}
                                    placeholder="Select color palette..."
                                >
                                    {colorPalettes.map(p => (
                                        <SelectItem key={p.name} value={JSON.stringify(p)}>
                                            {p.name} {p.colors.length > 0 ? `(${p.colors.map(c => c.replace('#', '')).join(', ')})` : ''}
                                        </SelectItem>
                                    ))}
                                </ClaySelect>
                            </div>
                        </ClaySection>
                    </div>

                    {/* Right Panel */}
                    <div className="lg:sticky lg:top-8 lg:h-fit">
                        <PromptPreview promptJson={generatePromptJson()} onClear={handleClear} />
                    </div>
                </div>
            </div>

            {/* Save Modal */}
            {showSaveModal && (
                <SavePromptModal
                    onSave={handleSave}
                    onCancel={() => setShowSaveModal(false)}
                />
            )}

            {/* Optimizer Chat Modal */}
            {showOptimizerChat && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Prompt Optimizer</h3>
                            <button
                                onClick={() => setShowOptimizerChat(false)}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>
                        <iframe
                            src="/PromptOptimizer"
                            className="flex-1 w-full border-0"
                            title="Prompt Optimizer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}