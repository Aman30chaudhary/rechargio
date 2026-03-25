import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Send, Check, CheckCheck } from 'lucide-react';
import { cn } from '../components/UI';

const Chat = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const chats = [
    { id: 1, name: 'Design Team', lastMessage: 'The new mockups look great!', time: '10:42 AM', unread: 2, avatar: 'D' },
    { id: 2, name: 'Alice Smith', lastMessage: 'Can we jump on a quick call?', time: '09:15 AM', unread: 0, avatar: 'A' },
    { id: 3, name: 'Engineering Sync', lastMessage: 'Deployment successful.', time: 'Yesterday', unread: 0, avatar: 'E' },
    { id: 4, name: 'Bob Jones', lastMessage: 'Thanks for the update.', time: 'Yesterday', unread: 0, avatar: 'B' },
    { id: 5, name: 'Marketing', lastMessage: 'Campaign goes live tomorrow.', time: 'Tuesday', unread: 5, avatar: 'M' },
  ];

  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey team, how are the new designs coming along?', sender: 'Alice', time: '10:30 AM', isMe: false },
    { id: 2, text: 'Almost done! Just polishing the mobile views.', sender: 'Me', time: '10:35 AM', isMe: true, status: 'read' },
    { id: 3, text: 'Awesome. Let me know when they are ready for review.', sender: 'Alice', time: '10:38 AM', isMe: false },
    { id: 4, text: 'Will do. Should be ready by EOD.', sender: 'Me', time: '10:40 AM', isMe: true, status: 'read' },
    { id: 5, text: 'The new mockups look great!', sender: 'Bob', time: '10:42 AM', isMe: false },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'Me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: 'Got it! Thanks.',
        sender: 'Alice',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }]);
    }, 2000);
  };

  const activeChatData = chats.find(c => c.id === activeChat);

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-surface overflow-hidden">
      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-surface shrink-0">
        {/* Search Header */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder:text-text-muted transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-border/50 last:border-0",
                activeChat === chat.id ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-base font-medium text-text truncate">{chat.name}</h3>
                  <span className={cn("text-xs shrink-0 ml-2", chat.unread ? "text-primary font-medium" : "text-text-muted")}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-text-muted truncate pr-2">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-[#EFEAE2] dark:bg-[#0B141A] relative">
        {/* Chat Header */}
        <div className="h-16 px-4 flex items-center justify-between bg-surface border-b border-border shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {activeChatData?.avatar}
            </div>
            <div>
              <h2 className="text-base font-medium text-text">{activeChatData?.name}</h2>
              <p className="text-xs text-text-muted">click here for contact info</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-text-muted">
            <Search size={20} className="cursor-pointer hover:text-text transition-colors" />
            <MoreVertical size={20} className="cursor-pointer hover:text-text transition-colors" />
          </div>
        </div>

        {/* Chat Background Pattern (WhatsApp style) */}
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'url("https://static.whatsapp.net/rsrc.php/v3/yl/r/gi_DckOUM5a.png")', backgroundRepeat: 'repeat' }} />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scrollbar relative z-10">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[65%] rounded-lg px-3 py-1.5 relative shadow-sm",
                msg.isMe ? "bg-[#D9FDD3] dark:bg-[#005C4B] text-gray-900 dark:text-gray-100 rounded-tr-none" : "bg-white dark:bg-[#202C33] text-gray-900 dark:text-gray-100 rounded-tl-none"
              )}>
                {!msg.isMe && <p className="text-xs font-bold text-primary mb-0.5">{msg.sender}</p>}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{msg.time}</span>
                  {msg.isMe && (
                    <span className="text-gray-400 dark:text-gray-400">
                      {msg.status === 'read' ? <CheckCheck size={14} className="text-[#53bdeb]" /> : <Check size={14} />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-surface border-t border-border shrink-0 z-10">
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <button type="button" className="p-2 text-text-muted hover:text-text transition-colors shrink-0">
              <Smile size={24} />
            </button>
            <button type="button" className="p-2 text-text-muted hover:text-text transition-colors shrink-0">
              <Paperclip size={24} />
            </button>
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Type a message"
                className="w-full bg-transparent border-transparent focus:ring-0 resize-none py-3 px-4 text-sm text-text placeholder:text-text-muted max-h-32 min-h-[44px] chat-scrollbar outline-none"
                rows="1"
              />
            </div>
            <button 
              type="submit" 
              disabled={!message.trim()}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={20} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
