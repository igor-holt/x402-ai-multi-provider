"use client";

import { useState } from "react";
import { modelID, models, modelsByProvider } from "@/lib/models";

export function ModelSelector({
  selectedModelId,
  onModelChange,
}: {
  selectedModelId: modelID;
  onModelChange: (modelId: modelID) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get current model display name
  const currentModelName = models[selectedModelId] || "Select Model";

  // Filter models based on search query
  const filteredProviders = Object.entries(modelsByProvider).filter(([provider, providerModels]) => {
    if (!searchQuery) return true;
    const providerMatch = provider.toLowerCase().includes(searchQuery.toLowerCase());
    const modelMatch = providerModels.some(model => 
      model.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return providerMatch || modelMatch;
  });

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg dark:hover:bg-zinc-700 hover:bg-zinc-200 cursor-pointer transition-colors text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-32 truncate">{currentModelName}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-700">
            <input
              type="text"
              placeholder="Search models..."
              className="w-full px-2 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 rounded border-none outline-none placeholder:text-zinc-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredProviders.length > 0 ? (
              filteredProviders.map(([provider, providerModels]) => (
                <div key={provider} className="py-2">
                  <div className="px-4 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {provider}
                  </div>
                  <div className="space-y-1">
                    {providerModels.map((model) => (
                      <button
                        key={model.id}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                          selectedModelId === model.id ? 'bg-zinc-100 dark:bg-zinc-800 font-medium' : ''
                        }`}
                        onClick={() => {
                          onModelChange(model.id);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="truncate">{model.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                No models found
              </div>
            )}
          </div>

          <div className="p-2 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
            <div className="text-xs text-zinc-500 text-center">
              Total: {Object.values(models).length} models across {Object.keys(modelsByProvider).length} providers
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
