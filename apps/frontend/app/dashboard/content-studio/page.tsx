"use client";

import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Sparkles,
  Download,
  Copy,
  Save,
  Clock,
  Wand2,
  Play,
  Pause,
  Volume2,
  Settings,
  Loader2,
} from "lucide-react";

type ContentType = "text" | "image" | "video" | "audio";

interface GeneratedContent {
  id: string;
  type: ContentType;
  prompt: string;
  content: string | null;
  timestamp: string;
  model?: string;
}

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState<ContentType>("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedContent[]>([
    {
      id: "1",
      type: "text",
      prompt: "Write an engaging email subject line for a product launch",
      content: "🚀 Revolutionary Product Launch: Transform Your Workflow in Minutes!",
      timestamp: "2 hours ago",
      model: "GPT-4",
    },
    {
      id: "2",
      type: "image",
      prompt: "Modern tech startup office with diverse team collaborating",
      content: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Generated+Image",
      timestamp: "3 hours ago",
      model: "DALL-E 3",
    },
  ]);

  const tabs = [
    { id: "text" as ContentType, name: "Text Content", icon: FileText, color: "from-blue-500 to-blue-600" },
    { id: "image" as ContentType, name: "Image Generation", icon: ImageIcon, color: "from-purple-500 to-purple-600" },
    { id: "video" as ContentType, name: "Video Creation", icon: Video, color: "from-pink-500 to-pink-600" },
    { id: "audio" as ContentType, name: "Audio & Voice", icon: Music, color: "from-green-500 to-green-600" },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Sparkles className="h-8 w-8 mr-3 text-blue-600" />
          Content Studio
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate engaging marketing content using AI-powered tools
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Generated Today</p>
            <Sparkles className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">47</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% vs yesterday</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Credits Used</p>
            <Wand2 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">234</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">of 500 this month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved Content</p>
            <Save className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">128</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total items</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Generation Time</p>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">3.2s</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Fast response</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "text" && <TextTab isGenerating={isGenerating} onGenerate={handleGenerate} />}
              {activeTab === "image" && <ImageTab isGenerating={isGenerating} onGenerate={handleGenerate} />}
              {activeTab === "video" && <VideoTab isGenerating={isGenerating} onGenerate={handleGenerate} />}
              {activeTab === "audio" && <AudioTab isGenerating={isGenerating} onGenerate={handleGenerate} />}
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generation History</h3>
            <div className="space-y-3">
              {history.map((item) => {
                const Icon = tabs.find(t => t.type === item.type)?.icon || FileText;
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                          {item.prompt}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.timestamp}</p>
                        {item.model && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                            {item.model}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextTab({ isGenerating, onGenerate }: { isGenerating: boolean; onGenerate: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("Your generated content will appear here...");
  const [useBrandVoice, setUseBrandVoice] = useState(true);

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content Type
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Blog Post</option>
            <option>Email</option>
            <option>Social Media Post</option>
            <option>Product Description</option>
            <option>Ad Copy</option>
            <option>Custom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            AI Model
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>GPT-4 (Best Quality)</option>
            <option>GPT-3.5 (Faster)</option>
            <option>Claude 3</option>
          </select>
        </div>
      </div>

      {/* Brand Voice Toggle */}
      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Use Brand Voice</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Apply your workspace brand guidelines</p>
          </div>
        </div>
        <button
          onClick={() => setUseBrandVoice(!useBrandVoice)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            useBrandVoice ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              useBrandVoice ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prompt
        </label>
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Describe what you want to generate... (e.g., 'Write an engaging blog post about AI in marketing')"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt}
        className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5 mr-2" />
            Generate Content
          </>
        )}
      </button>

      {/* Output Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated Output
          </label>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </button>
            <button className="inline-flex items-center px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Download className="h-3 w-3 mr-1" />
              Export
            </button>
            <button className="inline-flex items-center px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Save className="h-3 w-3 mr-1" />
              Save
            </button>
          </div>
        </div>
        <div className="min-h-[300px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{output}</p>
        </div>
      </div>
    </div>
  );
}

function ImageTab({ isGenerating, onGenerate }: { isGenerating: boolean; onGenerate: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image Size
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>1024x1024 (Square)</option>
            <option>1024x1792 (Portrait)</option>
            <option>1792x1024 (Landscape)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quality
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Standard</option>
            <option>HD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Style
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Natural</option>
            <option>Vivid</option>
            <option>Artistic</option>
          </select>
        </div>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image Description
        </label>
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Describe the image you want to generate... (e.g., 'A modern tech office with diverse team members collaborating')"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt}
        className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Generating Image...
          </>
        ) : (
          <>
            <ImageIcon className="h-5 w-5 mr-2" />
            Generate Image
          </>
        )}
      </button>

      {/* Image Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Generated Image
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-700 min-h-[400px]">
          {generatedImage ? (
            <img src={generatedImage} alt="Generated" className="max-w-full rounded-lg" />
          ) : (
            <div className="text-center">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Your generated image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoTab({ isGenerating, onGenerate }: { isGenerating: boolean; onGenerate: () => void }) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Duration
          </label>
          <input
            type="range"
            min="5"
            max="60"
            defaultValue="15"
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">15 seconds</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Aspect Ratio
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>16:9 (Landscape)</option>
            <option>9:16 (Portrait)</option>
            <option>1:1 (Square)</option>
          </select>
        </div>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Video Script / Description
        </label>
        <textarea
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Describe your video content or provide a script..."
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt}
        className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Generating Video...
          </>
        ) : (
          <>
            <Video className="h-5 w-5 mr-2" />
            Generate Video
          </>
        )}
      </button>

      {/* Video Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Video Preview
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-700 min-h-[400px]">
          <div className="text-center">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Your generated video will appear here</p>
            <p className="text-xs text-gray-400 mt-2">Note: Video generation may take several minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioTab({ isGenerating, onGenerate }: { isGenerating: boolean; onGenerate: () => void }) {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Voice
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Alloy (Neutral)</option>
            <option>Echo (Male)</option>
            <option>Fable (British Male)</option>
            <option>Onyx (Deep Male)</option>
            <option>Nova (Female)</option>
            <option>Shimmer (Soft Female)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Speed
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            defaultValue="1"
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1.0x (Normal)</p>
        </div>
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Text to Speech
        </label>
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Enter the text you want to convert to speech..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {text.length} characters
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !text}
        className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Generating Audio...
          </>
        ) : (
          <>
            <Music className="h-5 w-5 mr-2" />
            Generate Audio
          </>
        )}
      </button>

      {/* Audio Player */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Audio Player
        </label>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-300 dark:border-gray-600">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <div className="flex-1">
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0:00</span>
                <span>0:00</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <Volume2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
