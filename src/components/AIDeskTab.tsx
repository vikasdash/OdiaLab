import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Trash2, HelpCircle, Loader2, Award, ArrowUpRight, MessageSquareCode } from "lucide-react";
import { ChatMessage, StudentProfile } from "../types";

interface AIDeskTabProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  category: string;
}

export default function AIDeskTab({ profile, setProfile, category }: AIDeskTabProps) {
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-guru",
      role: "model",
      content: `ନମସ୍କାର **${profile.name}**! I am **OdiaLab Guru AI**, your personal state civil services academic doubts desk coach.

How can I help you excel today? You can:
1. Ask doubts regarding **Odia Grammar (ଓଡ଼ିଆ ବ୍ୟାକରଣ)** which is highly scoring.
2. Search details about **Odisha History, Rivers, or General Knowledge**.
3. Translate study points from English to Odia or vice-versa.
4. Request practice MCQs on any subject!

*Type your query below or pick a quick start prompt to trigger absolute preparation!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when message arrives
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickChips = [
    { label: "ସମାସ କଣ? ଉଦାହରଣ ଦିଅନ୍ତୁ 📝" },
    { label: "Explain Odisha Geographical River systems 🏞️" },
    { label: "Compare English vs Odia sentence structure 📊" },
    { label: "Give me 1 hard OPSC GK practice question 🏆" }
  ];

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Map historical exchanges to standard role patterns
      const logs = messages.concat(userMsg).map(m => ({
        role: m.role,
        content: m.content
      }));

      // Call our server backend API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: logs,
          category: category || "General Coaching"
        })
      });

      if (!res.ok) {
        throw new Error("Tutor server rejected connection. Make sure API keys are configured.");
      }

      const data = await res.json();
      const modelSpeech = data.response;

      setMessages(prev => [...prev, {
        id: `guru-${Date.now()}`,
        role: "model",
        content: modelSpeech,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Boost study minutes upon tutoring interaction
      setProfile(p => ({
        ...p,
        studyMinutes: p.studyMinutes + 15
      }));

    } catch (err: any) {
      console.error("Guru chat stream block failed:", err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: "model",
        content: `⚠️ **Session Connection Issue**
I am unable to reach the OdiaLab servers right now. Please verify that your **GEMINI_API_KEY** is registered in the AI Studio **Secrets panel** to activate full conversational parameters!

In the meantime, feel free to explore our offline mock tests and revision lists.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatLogs = () => {
    if (confirm("Are you sure you want to clear your learning interaction thread?")) {
      setMessages([
        {
          id: "initial-guru",
          role: "model",
          content: `Thread refreshed! Ready to assist you with new competitive exams and Odia language coaching doubts.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Safe client-side markdown formatter for bullets, tables, bold, and paragraph alignments
  const cleanMarkdownRender = (text: string) => {
    if (!text) return "";
    
    // Split text by lines
    const lines = text.split("\n");
    return lines.map((line, blockIdx) => {
      let trimmed = line.trim();

      // Bold text formatting
      const formattedBold = (str: string) => {
        const parts = str.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-900 bg-slate-100 rounded px-1">{part}</strong> : part));
      };

      // Table mapping helper
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        // Skip header separators like |---|---|
        if (trimmed.includes("---")) return null;
        const cols = trimmed.split("|").map(c => c.trim()).filter(Boolean);
        return (
          <div key={blockIdx} className="overflow-x-auto my-1 bg-white border border-slate-150 rounded-lg p-2 font-mono text-[10px]">
            <table className="min-w-full">
              <tbody>
                <tr>
                  {cols.map((col, cIdx) => (
                    <td key={cIdx} className="border-r border-slate-100 last:border-0 px-2 py-1 select-text">
                      {formattedBold(col)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      // Headers mapping
      if (trimmed.startsWith("###")) {
        return <h5 key={blockIdx} className="text-xs font-bold text-slate-950 mt-3 mb-1 font-display">{formattedBold(trimmed.substring(3))}</h5>;
      }
      if (trimmed.startsWith("##")) {
        return <h4 key={blockIdx} className="text-sm font-bold text-primary-500 mt-4 mb-1.5 font-display flex items-center gap-1">{formattedBold(trimmed.substring(2))}</h4>;
      }
      if (trimmed.startsWith("#")) {
        return <h3 key={blockIdx} className="text-base font-bold text-primary-500 mt-5 mb-2 font-display">{formattedBold(trimmed.substring(1))}</h3>;
      }

      // Bullet lists mapping
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <li key={blockIdx} className="text-xs text-slate-700 ml-4 list-disc list-outside my-1 leading-relaxed">
            {formattedBold(trimmed.substring(1).trim())}
          </li>
        );
      }

      // Ordered numeric list item
      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={blockIdx} className="text-xs text-slate-700 font-semibold flex gap-1.5 justify-start items-start my-1 pl-1">
            <span className="text-primary-500">{numMatch[1]}.</span>
            <p className="font-medium text-slate-700 leading-relaxed leading-snug">{formattedBold(numMatch[2])}</p>
          </div>
        );
      }

      // Default empty line yields spacing
      if (!trimmed) {
        return <div key={blockIdx} className="h-2" />;
      }

      // Normal paragraph line
      return (
        <p key={blockIdx} className="text-xs font-medium text-slate-700 leading-relaxed font-sans mb-1.5">
          {formattedBold(line)}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col flex-1 h-full max-h-full overflow-hidden select-text">
      
      {/* 1. Header with details */}
      <div className="bg-white border-b border-slate-100 p-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center font-bold relative shadow-xs">
            ☕
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary-500 rounded-full border border-white"></span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-950">Guru Doubts Assistant</h4>
            <p className="text-[10px] text-slate-400 font-medium">Standard Academic Model Active</p>
          </div>
        </div>

        <button
          onClick={clearChatLogs}
          title="Refresh Interaction logs"
          className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-rose-500 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-slate-200"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>

      {/* 2. Messages Bubble Area */}
      <div className="flex-1 overflow-y-auto w-full p-4 flex flex-col gap-3.5 bg-slate-50">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div 
              key={m.id}
              className={`flex flex-col max-w-[85%] ${
                isUser ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div className={`p-3 rounded-2xl text-xs font-sans shadow-sm ${
                isUser 
                  ? "bg-primary-500 text-white rounded-br-none" 
                  : "bg-white text-slate-800 rounded-bl-none border border-slate-200/60"
              }`}>
                {/* Visual Accent Title inside Speech bubbles */}
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-primary-600 font-bold font-mono tracking-widest text-[9px] border-b border-primary-50 pb-1 uppercase select-none">
                    <Sparkles size={10} className="fill-accent-500 text-accent-500" />
                    <span>OI Guru response</span>
                  </div>
                )}
                {isUser ? (
                  <p className="font-semibold leading-relaxed whitespace-pre-line">{m.content}</p>
                ) : (
                  <div className="space-y-1">{cleanMarkdownRender(m.content)}</div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 font-mono font-bold mt-1 select-none">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {/* Typing spinner for loading animation state */}
        {isLoading && (
          <div className="mr-auto items-start max-w-[85%] flex flex-col">
            <div className="bg-white border border-slate-200 text-slate-500 p-3 rounded-2xl rounded-bl-none flex items-center gap-2.5 shadow-sm text-xs">
              <Loader2 className="animate-spin text-primary-500" size={14} />
              <span className="font-medium">OdiaLab Guru is drafting guidelines...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* 3. Prebuilt Prompt Chips (Render only when chat is fresh or idle) */}
      {messages.length < 5 && !isLoading && (
        <div className="bg-slate-50 border-t border-slate-200/40 px-3 pt-2 pb-1 bg-white select-none">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Frequently Searched Doubts</span>
          <div className="flex flex-col gap-1.5 mt-2">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.label)}
                className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-left text-slate-700 hover:text-slate-900 border border-slate-200 text-[11px] rounded-xl hover:border-primary-200 transition-all font-semibold flex items-center justify-between cursor-pointer group"
              >
                <span>{chip.label}</span>
                <ArrowUpRight size={12} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Controls Keyboard Input row */}
      <div className="bg-white border-t border-slate-150 p-2.5 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage(input);
          }}
          disabled={isLoading}
          placeholder="Ask doubting points in English/ଓଡ଼ିଆ..."
          className="flex-1 bg-slate-100 hover:bg-slate-200/50 focus:bg-white focus:ring-2 focus:ring-primary-500 text-slate-800 text-xs py-2.5 px-3.5 rounded-xl outline-hidden border border-slate-250 transition-all placeholder:text-slate-500 font-semibold"
        />
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || isLoading}
          className={`h-9 w-9 p-0 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            input.trim() && !isLoading
              ? "bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/20" 
              : "bg-slate-150 text-slate-400 cursor-not-allowed"
          }`}
        >
          <Send size={15} className="ml-0.5" />
        </button>
      </div>

    </div>
  );
}
