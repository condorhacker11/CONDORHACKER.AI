import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Volume2, StopCircle, User, Activity } from 'lucide-react';
import { Message, AgentType } from '../types';
import { AGENTS_MAP } from '../constants';
import { AgentAvatar } from './AgentAvatar';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Parse active agent from content if it exists
  let displayContent = message.content;
  let agentType: AgentType = 'UNKNOWN';

  if (!isUser) {
    const agentMatch = message.content.match(/^Agente attivo:\s*(CONDOR-[A-Z\s]+)/i);
    if (agentMatch) {
      const rawAgentName = agentMatch[1].toUpperCase().trim();
      if (rawAgentName in AGENTS_MAP) {
        agentType = rawAgentName as AgentType;
      } else {
        agentType = 'CONDOR-MANAGER'; 
      }
    } else if (message.content.length > 0) {
       agentType = 'UNKNOWN';
    }
  }

  const agentConfig = AGENTS_MAP[agentType];

  useEffect(() => {
    // Cleanup speech when component unmounts
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const stripMarkdown = (text: string) => {
    return text
      .replace(/[*#_`~]/g, '') // Remove basic formatting chars
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just text
      .replace(/^\s*[-+]\s+/gm, '') // Remove list bullets
      .replace(/```[\s\S]*?```/g, 'Code block omitted.') // Skip code blocks
      .trim();
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = stripMarkdown(displayContent);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'it-IT';
    
    // Fetch voices synchronously when needed
    const voices = window.speechSynthesis.getVoices();
    
    // Filter for Italian voices
    const itVoices = voices.filter(v => v.lang.startsWith('it'));
    const availableVoices = itVoices.length > 0 ? itVoices : voices;
    
    let selectedVoice = availableVoices[0];

    // Gender-based voice selection heuristic
    if (agentConfig && agentConfig.gender) {
        const preferredGender = agentConfig.gender;
        const genderVoice = availableVoices.find(v => {
            const name = v.name.toLowerCase();
            if (preferredGender === 'female') {
                return name.includes('elsa') || 
                       name.includes('alice') || 
                       name.includes('paola') || 
                       name.includes('federica') ||
                       name.includes('google italiano') || 
                       name.includes('female');
            } else {
                return name.includes('luca') || 
                       name.includes('diego') || 
                       name.includes('cosimo') || 
                       name.includes('carlo') || 
                       name.includes('male');
            }
        });
        
        if (genderVoice) {
            selectedVoice = genderVoice;
        }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Persona-based voice tuning
    if (agentType === 'CONDOR-ROBO') {
        utterance.pitch = 0.9;
        utterance.rate = 1.1;
    } else if (agentType === 'CONDOR-MEDICA') {
        utterance.rate = 0.95; // More soothing
    } else if (agentType === 'CONDOR-TECH') {
        utterance.rate = 1.05; // Quick technical explanation
    } else if (agentType === 'CONDOR-EDU') {
        utterance.rate = 0.9; // Clear, educational pacing
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-400" />
             </div>
          ) : (
             <AgentAvatar agentType={agentType} className="w-8 h-8 md:w-10 md:h-10 shadow-lg" />
          )}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
          
          {/* Agent Badge (Only for model) */}
          {!isUser && message.content && (
            <div className={`flex items-center flex-wrap gap-2 mb-1.5`}>
              <span className={`text-sm font-bold ${agentConfig.color}`}>
                {agentConfig.personaName}
              </span>
              <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 rounded">
                {agentConfig.name === 'CONDOR-SYSTEM' && agentType !== 'UNKNOWN' ? agentType : agentConfig.name}
              </span>
              {isSpeaking && (
                 <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-900/30 border border-cyan-800/50">
                    <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span className="text-[9px] text-cyan-300 font-mono">SPEAKING</span>
                 </span>
              )}
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`
              relative p-4 rounded-2xl text-sm md:text-base shadow-lg backdrop-blur-sm
              ${isUser 
                ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm border border-zinc-700' 
                : `bg-zinc-900/80 text-zinc-300 rounded-tl-sm border ${agentConfig.borderColor} shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)]`
              }
            `}
          >
            {message.isError ? (
               <span className="text-red-400 font-mono">ERROR: {message.content}</span>
            ) : (
              <div className={`markdown-body prose prose-invert prose-sm max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-zinc-800 font-sans leading-relaxed break-words`}>
                <ReactMarkdown 
                  components={{
                    code({node, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return match ? (
                        <code className={`${className} block bg-black/60 p-2 rounded border border-zinc-800 font-mono text-xs md:text-sm overflow-x-auto`} {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="bg-zinc-800 px-1 py-0.5 rounded font-mono text-xs text-zinc-200" {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Footer Actions (Timestamp + TTS) */}
          <div className="flex items-center gap-2 mt-1 px-1">
             <span className="text-[10px] text-zinc-600">
               {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
             
             {!isUser && !message.isError && (
               <button 
                 onClick={handleSpeak}
                 className={`
                    p-1.5 rounded-full transition-all duration-200
                    ${isSpeaking 
                        ? 'bg-cyan-900/30 text-cyan-400 ring-1 ring-cyan-500/50' 
                        : 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }
                 `}
                 title={isSpeaking ? "Ferma audio" : "Ascolta risposta"}
               >
                 {isSpeaking ? <StopCircle className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
               </button>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};
