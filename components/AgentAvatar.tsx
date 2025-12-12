import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { AgentType } from '../types';
import { AGENTS_MAP } from '../constants';
import { generateAgentImage } from '../services/geminiService';
import { saveAvatarToDB, getAvatarFromDB, clearLegacyLocalStorageAvatars } from '../services/storage';
import { IconRenderer } from './IconRenderer';

interface AgentAvatarProps {
  agentType: AgentType;
  className?: string;
  showIconFallback?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({ agentType, className, showIconFallback = false }) => {
  const config = AGENTS_MAP[agentType] || AGENTS_MAP['UNKNOWN'];
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAvatar = async () => {
      if (config.id === 'UNKNOWN') return;

      // 1. MIGRATION CHECK: Check Local Storage first (Legacy)
      const legacyKey = `condor_avatar_v2_${config.id}`;
      const legacyImage = localStorage.getItem(legacyKey);
      
      if (legacyImage) {
        if (isMounted) setImageUrl(legacyImage);
        await saveAvatarToDB(config.id, legacyImage);
        localStorage.removeItem(legacyKey);
        return;
      }

      // 2. Check IndexedDB (New Storage)
      const dbImage = await getAvatarFromDB(config.id);
      if (dbImage) {
        if (isMounted) setImageUrl(dbImage);
        return;
      }

      // 3. AUTO-GENERATION DISABLED to prevent Quota Exceeded errors with 50+ agents.
      // User must explicitly request generation via the button.
    };

    loadAvatar();

    return () => {
      isMounted = false;
    };
  }, [config.id]);

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click
    if (loading) return;
    
    setLoading(true);
    setError(false);
    try {
        const generatedUrl = await generateAgentImage(config);
        if (generatedUrl) {
            setImageUrl(generatedUrl);
            await saveAvatarToDB(config.id, generatedUrl);
            clearLegacyLocalStorageAvatars(config.id);
        } else {
            setError(true);
        }
    } catch (err) {
        console.error(err);
        setError(true);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`relative overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center ${className}`}>
        <Loader2 className={`w-1/2 h-1/2 ${config.color} animate-spin`} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 group ${className}`}>
        {imageUrl ? (
            <>
                <img 
                    src={imageUrl} 
                    alt={config.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <button 
                    onClick={handleRegenerate}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity z-10 gap-1"
                    title="Rigenera Volto con AI"
                >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-[8px] font-mono text-white uppercase tracking-wider">Redraw</span>
                </button>
            </>
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 relative group">
                {/* Fallback Icon */}
                <div className={`${config.color} opacity-80 group-hover:opacity-40 transition-opacity`}>
                    <IconRenderer agentType={agentType} className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                
                {/* Generate Button Overlay */}
                <button 
                    onClick={handleRegenerate}
                    className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 bg-black/60"
                    title="Genera Volto AI"
                >
                     <Sparkles className={`w-4 h-4 ${error ? 'text-red-500' : 'text-cyan-400'}`} />
                     <span className="text-[7px] font-mono text-zinc-300 uppercase mt-0.5">
                        {error ? 'Retry' : 'Gen AI'}
                     </span>
                </button>
            </div>
        )}
    </div>
  );
};