import React, { useState } from 'react';
import { X, BookOpen, Copy, Download, Sparkles, Film, Palette, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavedPrompt } from '@/entities/SavedPrompt';

const EXTENSIVE_PROMPT_LIBRARY = {
    "cinematic_techniques": [
        {
            title: "Dramatic Close-Up with Depth",
            technique: "Veo 3 Flow Pattern",
            description: "Extreme close-up with cinematic depth of field and emotional focus",
            prompt: {
                scene_description: "Extreme close-up of a woman's eyes, tears forming at the corners, reflecting city lights in the pupils. Mascara slightly smudged, telling a story of raw emotion.",
                shot_composition: "Extreme close-up",
                camera_movement: "Subtle push-in from 0.5m to 0.3m over 3 seconds, then hold steady",
                visual_style: "Cinematic",
                lighting: "Soft key light from 45 degrees, rim light creating separation, practical lights in background",
                environment: "Blurred city lights bokeh background, cool blue and warm orange tones",
                audio_cue: "Distant city ambience, muffled traffic, emotional music swelling"
            }
        },
        {
            title: "Epic Establishing Shot",
            technique: "Whisper Method - Layered Description",
            description: "Sweeping aerial establishing shot with gradual reveal",
            prompt: {
                scene_description: "Aerial view descending through morning mist over ancient temple complex surrounded by dense jungle. Sun rays piercing through fog, golden hour lighting revealing intricate architecture layer by layer.",
                shot_composition: "Wide aerial tracking shot",
                camera_movement: "Crane shot descending from 100m to 10m altitude over 8 seconds, gentle forward motion",
                visual_style: "Cinematic documentary style with hyper-realistic rendering",
                lighting: "Golden hour with volumetric god rays, high dynamic range",
                environment: "Lush jungle canopy, stone temples with moss coverage, morning mist layer at mid-height",
                audio_cue: "Ambient jungle sounds, distant wildlife, inspirational orchestral score building"
            }
        },
        {
            title: "Tension Builder - Dutch Angle",
            technique: "Gemini Flow Technique",
            description: "Psychological tension through unconventional framing",
            prompt: {
                scene_description: "A detective's cluttered office desk viewed from an unsettling 25-degree tilted angle. Case files scattered, red string connecting photos on evidence board in background, single desk lamp casting dramatic shadows.",
                shot_composition: "Dutch angle shot at 25 degrees, medium-wide framing",
                camera_movement: "Slow clockwise rotation from 25 to 35 degrees over 5 seconds, increasing unease",
                visual_style: "Film Noir with desaturated color except warm amber lamp",
                lighting: "Single practical source (desk lamp), harsh shadows, venetian blind patterns on walls",
                environment: "Dark office, cigarette smoke wisps visible in light beam, rain on window",
                audio_cue: "Ticking clock, distant thunder, tension-building strings",
                dialogue: "The evidence was right there... I just didn't want to see it."
            }
        },
        {
            title: "Intimate Conversation - Over Shoulder",
            technique: "Professional Blocking Method",
            description: "Two-person dialogue with emotional connection",
            prompt: {
                scene_description: "Over-the-shoulder shot of two colleagues having a difficult conversation in a modern glass office. View from behind person A's left shoulder, focusing on person B's conflicted expression, city skyline visible through windows.",
                shot_composition: "Over-the-shoulder shot, rule of thirds composition",
                camera_movement: "Subtle dolly-in from 1.5m to 1m during emotional peak at 4 seconds",
                visual_style: "Contemporary corporate realism with soft focus",
                lighting: "Natural window light creating soft fill, practical office lighting, subtle backlight separating subjects",
                environment: "Modern glass office, blurred cityscape background, minimalist furniture",
                audio_cue: "Muffled office ambience, distant phone rings, intimate room tone",
                dialogue: "I know this isn't what you wanted to hear, but we need to face the truth."
            }
        }
    ],
    "advanced_movements": [
        {
            title: "Vertigo Effect (Dolly Zoom)",
            technique: "Technical Precision Method",
            description: "Creating psychological disorientation effect",
            prompt: {
                scene_description: "A character standing in a long corridor, moment of realization hitting them. Background seems to stretch away while they remain in focus, creating disorienting effect.",
                shot_composition: "Medium shot centered on subject",
                camera_movement: "Dolly zoom: camera tracks backward 3 meters while simultaneously zooming in to maintain subject size, executed over 4 seconds",
                visual_style: "Hitchcockian thriller aesthetic",
                lighting: "Practical corridor lights creating perspective lines, dramatic side lighting on subject",
                environment: "Long symmetrical corridor with repeating elements emphasizing depth",
                audio_cue: "Low frequency rumble building, dissonant string chord",
                dialogue: "Oh god... it was me all along."
            }
        },
        {
            title: "Whip Pan Transition",
            technique: "Dynamic Energy Method",
            description: "High-energy scene transition through motion blur",
            prompt: {
                scene_description: "Fast-paced montage element: camera rapidly pans from subject A to subject B, creating natural motion blur transition. Urban environment, multiple people in frame.",
                shot_composition: "Medium shot transitioning through extreme motion blur",
                camera_movement: "Ultra-fast 180-degree horizontal pan executed in 0.5 seconds, settling on new subject",
                visual_style: "Dynamic documentary with motion blur trails",
                lighting: "High-contrast urban lighting, practical neon signs contributing to blur effect",
                environment: "Busy urban street at night, neon signs, moving traffic",
                audio_cue: "Whoosh sound effect synchronized with pan, city ambience"
            }
        },
        {
            title: "Orbiting Hero Shot",
            technique: "360-Degree Showcase",
            description: "Complete circular camera movement showcasing subject",
            prompt: {
                scene_description: "Professional athlete standing confidently in stadium, camera orbiting 360 degrees around them. Dramatic lighting, stadium lights creating halo effect, crowd blurred in background.",
                shot_composition: "Medium-full shot maintaining subject center frame",
                camera_movement: "Complete 360-degree orbit at 2.5m radius, constant speed, 6-second duration",
                visual_style: "Heroic commercial photography style with high production value",
                lighting: "Dramatic three-point lighting, rim lights from stadium, atmospheric haze for depth",
                environment: "Professional sports stadium, crowd as bokeh background, fog effects",
                audio_cue: "Epic orchestral crescendo, crowd roar fading to silence at 180 degrees"
            }
        }
    ],
    "style_mastery": [
        {
            title: "Wes Anderson Symmetry",
            technique: "Stylized Auteur Technique",
            description: "Perfectly symmetrical, pastel-colored, quirky framing",
            prompt: {
                scene_description: "Perfectly centered shot of a peculiar hotel concierge standing in symmetrical lobby. Pastel pink walls, mint green furniture, geometric patterns, character making direct eye contact with camera.",
                shot_composition: "Dead-center symmetrical framing, medium shot",
                camera_movement: "Static locked-off shot, no movement, architectural precision",
                visual_style: "Wes Anderson aesthetic: pastel color palette, flat depth, meticulous symmetry",
                lighting: "Evenly distributed soft lighting, no harsh shadows, artificial perfection",
                environment: "Stylized hotel lobby with perfect symmetry, vintage furniture, pastel color scheme",
                audio_cue: "Vintage French accordion music, precise foley sounds",
                dialogue: "Welcome to the Grand Budapest Hotel. We've been expecting you."
            }
        },
        {
            title: "Cyberpunk Neon Noir",
            technique: "Genre-Specific Atmosphere",
            description: "High-tech dystopian urban aesthetic",
            prompt: {
                scene_description: "Rain-soaked cyberpunk street, neon signs reflecting in puddles, hooded figure walking away from camera through crowds of people with umbrellas. Holographic advertisements float in mid-air.",
                shot_composition: "Wide shot from elevated position, rule of thirds with figure in lower third",
                camera_movement: "Slow tracking shot following figure for 6 seconds, maintaining distance",
                visual_style: "Blade Runner-inspired cyberpunk with neon saturation and film grain",
                lighting: "Neon lighting in cyan, magenta, yellow creating color contrast, practicals from signs",
                environment: "Futuristic Asian-influenced megacity, rain effects, steam vents, crowded streets",
                audio_cue: "Synth wave soundtrack, rain ambience, distant city hum, electronic ad jingles"
            }
        },
        {
            title: "Dreamy Soft Focus Romance",
            technique: "Emotional Mood Building",
            description: "Ethereal romantic atmosphere with soft edges",
            prompt: {
                scene_description: "Couple slow dancing in golden-hour flooded room, dust particles visible in light beams, soft focus giving dreamy quality. Curtains gently moving from breeze.",
                shot_composition: "Medium-wide shot, slightly low angle elevating romance",
                camera_movement: "Gentle slow orbit around couple, 120-degree arc over 7 seconds",
                visual_style: "Soft-focus romantic cinematography with glowing highlights and muted colors",
                lighting: "Golden hour window light with practical candles, soft fill reducing contrast",
                environment: "Elegant room with vintage furniture, sheer curtains, warm wood tones",
                audio_cue: "Romantic piano melody, soft ambient room tone, distant birdsong",
                dialogue: "Do you remember when we first met? It feels like yesterday."
            }
        },
        {
            title: "Horror Suspense Build",
            technique: "Psychological Tension Method",
            description: "Building dread through environmental storytelling",
            prompt: {
                scene_description: "POV shot walking down abandoned hospital corridor, flickering fluorescent lights, wheelchair slowly rolling across hallway ahead, papers blowing from unseen source.",
                shot_composition: "First-person POV, handheld aesthetic",
                camera_movement: "Slow forward dolly at walking pace, slight handheld shake, sudden pause when wheelchair appears",
                visual_style: "Found-footage horror with desaturated colors except cold blue-green tint",
                lighting: "Flickering practical fluorescents, deep shadows in doorways, single emergency light",
                environment: "Abandoned medical facility, peeling walls, scattered equipment, ominous doorways",
                audio_cue: "Footsteps echoing, fluorescent buzz, wheelchair squeak, distant metallic clang, heartbeat rising"
            }
        }
    ],
    "micro_moments": [
        {
            title: "Product Reveal Macro",
            technique: "Commercial Showcase Method",
            description: "Luxury product introduction with premium feel",
            prompt: {
                scene_description: "Extreme macro shot of luxury watch, camera slowly revealing details: polished metal case, intricate dial, precision movement visible through sapphire crystal. Subtle reflections and refractions.",
                shot_composition: "Extreme close-up macro, shallow depth of field",
                camera_movement: "Precision macro dolly sliding horizontally at 2cm/second, then subtle tilt up",
                visual_style: "Hyper-realistic commercial photography, high production value",
                lighting: "Studio lighting setup: key light at 45 degrees, fill reducing shadows, rim light for separation",
                environment: "Seamless white background gradually transitioning to soft gradient, minimalist",
                audio_cue: "Delicate mechanical watch sounds, sophisticated ambient music"
            }
        },
        {
            title: "Food Styling Perfection",
            technique: "Culinary Cinematography",
            description: "Mouth-watering food presentation",
            prompt: {
                scene_description: "Overhead shot of chef's hands meticulously plating gourmet dish. Sauce being drizzled in artistic pattern, microgreens being placed with tweezers, final garnish completing composition.",
                shot_composition: "Bird's eye view, extreme close-up of plate",
                camera_movement: "Locked overhead shot, possible slight push-in during final garnish",
                visual_style: "High-end culinary photography with rich colors and textures",
                lighting: "Soft overhead key with fill from sides, highlighting textures and colors",
                environment: "Professional kitchen plating station, marble surface, minimal props",
                audio_cue: "Precise cooking sounds, utensils on plates, kitchen ambience"
            }
        }
    ],
    "transition_techniques": [
        {
            title: "Match Cut Timeline",
            technique: "Visual Continuity Method",
            description: "Seamless transition through similar shapes/actions",
            prompt: {
                scene_description: "Close-up of spinning vinyl record dissolving into overhead shot of spinning pottery wheel, maintaining rotational movement and circular framing throughout transition.",
                shot_composition: "Centered circular composition maintained through transition",
                camera_movement: "Subtle rotation matching subject rotation, smooth transition between scenes",
                visual_style: "Match-cut transition technique with complementary color palettes",
                lighting: "Consistent rim lighting on both spinning objects creating visual continuity",
                environment: "Music studio to pottery studio, maintaining warm aesthetic",
                audio_cue: "Music fading to pottery wheel sound, maintaining rhythm"
            }
        }
    ]
};

export default function PromptLibraryModal({ onClose, onImport }) {
    const [selectedCategory, setSelectedCategory] = useState('cinematic_techniques');
    const [expandedIndex, setExpandedIndex] = useState(null);

    const categories = {
        cinematic_techniques: { name: 'Cinematic Techniques', icon: Film, color: 'from-purple-500 to-purple-600' },
        advanced_movements: { name: 'Advanced Camera Moves', icon: Sparkles, color: 'from-blue-500 to-blue-600' },
        style_mastery: { name: 'Style Mastery', icon: Palette, color: 'from-pink-500 to-pink-600' },
        micro_moments: { name: 'Micro Moments', icon: Lightbulb, color: 'from-green-500 to-green-600' },
        transition_techniques: { name: 'Transitions', icon: Sparkles, color: 'from-orange-500 to-orange-600' }
    };

    const currentPrompts = EXTENSIVE_PROMPT_LIBRARY[selectedCategory] || [];

    const handleImport = async (promptTemplate) => {
        await SavedPrompt.create({
            title: promptTemplate.title,
            description: `${promptTemplate.technique} - ${promptTemplate.description}`,
            prompt_data: promptTemplate.prompt,
            tags: ['imported', 'library', promptTemplate.technique.toLowerCase().replace(/\s+/g, '-')],
            collection: 'Prompt Library'
        });
        alert('Prompt imported to your library!');
    };

    const handleCopy = (prompt) => {
        navigator.clipboard.writeText(JSON.stringify(prompt, null, 2));
        alert('Prompt copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                <BookOpen className="w-8 h-8" />
                                Professional Prompt Library
                            </h2>
                            <p className="text-white/80">Curated prompts from Veo 3, Gemini Flow & Whisper techniques</p>
                        </div>
                        <button onClick={onClose} className="text-white hover:text-white/80 transition-all">
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 overflow-x-auto">
                    <div className="flex gap-2">
                        {Object.entries(categories).map(([key, cat]) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setSelectedCategory(key);
                                        setExpandedIndex(null);
                                    }}
                                    className={`px-4 py-2 rounded-2xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                                        selectedCategory === key
                                            ? `bg-gradient-to-br ${cat.color} text-white`
                                            : 'bg-white text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {currentPrompts.map((template, idx) => (
                            <div
                                key={idx}
                                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">{template.title}</h3>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold">
                                                    {template.technique}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm">{template.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleImport(template)}
                                                size="sm"
                                                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Import
                                            </Button>
                                            <Button
                                                onClick={() => handleCopy(template.prompt)}
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        {expandedIndex === idx ? '▼ Hide Details' : '▶ Show Full Prompt'}
                                    </button>

                                    {expandedIndex === idx && (
                                        <div className="mt-4 bg-white rounded-xl p-4 border border-slate-200">
                                            <pre className="text-xs text-slate-700 whitespace-pre-wrap overflow-auto max-h-96">
                                                {JSON.stringify(template.prompt, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-sm text-slate-600">
                    {currentPrompts.length} professional prompts • Updated with latest Veo 3 & Gemini Flow techniques
                </div>
            </div>
        </div>
    );
}