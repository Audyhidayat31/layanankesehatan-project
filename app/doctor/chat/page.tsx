'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, Search, Phone, Video, MoreVertical, 
  Paperclip, ImageIcon, CheckCheck, Smile, Mic 
} from 'lucide-react'

// Using local mock data for simplicity to maintain current state shape
const initialChats = [
  { id: 'p1', name: 'Budi Santoso', lastMessage: 'Dokter, obatnya sudah habis.', time: '10:30', unread: 2, avatar: '/avatars/patient-1.jpg' },
  { id: 'p2', name: 'Siti Aminah', lastMessage: 'Terima kasih banyak, Dok.', time: 'Kemarin', unread: 0, avatar: '/avatars/patient-2.jpg' },
  { id: 'p3', name: 'Andi Pratama', lastMessage: 'Apakah saya boleh makan pedas?', time: 'Kemarin', unread: 0 },
]

const initialMessages = [
  { id: 'm1', sender: 'doctor', text: 'Halo Pak Budi, bagaimana kabarnya hari ini?', time: '10:00', isRead: true },
  { id: 'm2', sender: 'patient', text: 'Masih agak pusing Dok, tapi tensi sudah turun.', time: '10:05', isRead: true },
  { id: 'm3', sender: 'doctor', text: 'Bagus. Obatnya tolong dihabiskan ya.', time: '10:10', isRead: true },
  { id: 'm4', sender: 'patient', text: 'Baik Dok.', time: '10:15', isRead: true },
  { id: 'm5', sender: 'patient', text: 'Dokter, obatnya sudah habis.', time: '10:30', isRead: false },
]

export default function DoctorChatPage() {
  const [chats] = useState(initialChats)
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [activeChat, setActiveChat] = useState(chats[0])
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: `m${Date.now()}`,
      sender: 'doctor',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="doctor" />
      <DashboardHeader role="doctor" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <Card className="flex h-[calc(100vh-140px)] overflow-hidden shadow-md border-muted">
            {/* Sidebar Chat List */}
            <div className="w-80 border-r border-border bg-card flex flex-col">
              <div className="bg-muted/30 p-3 flex items-center justify-between border-b border-border h-16">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    ME
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="p-2 border-b border-border bg-card">
                <div className="relative bg-muted/50 rounded-lg flex items-center px-3 py-1">
                  <Search className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    placeholder="Cari pasien atau pesan"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-8"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50 ${
                      activeChat.id === chat.id ? 'bg-muted' : ''
                    }`}
                  >
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(chat.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden border-b border-border/50 pb-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground truncate text-sm">
                          {chat.name}
                        </h4>
                        <span className={`text-xs ${chat.unread > 0 ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm text-muted-foreground">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-emerald-500 text-white text-[10px] shrink-0">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex flex-1 flex-col bg-[#efeae2] dark:bg-muted/10 relative">
              {/* WhatsApp-like background pattern */}
              <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")', backgroundRepeat: 'repeat' }}></div>
              
              {/* Chat Header */}
              <div className="flex items-center justify-between bg-card p-3 border-b border-border h-16 z-10 relative">
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeChat.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(activeChat.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {activeChat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-muted">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-muted">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-1"></div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-muted">
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-muted">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 z-10" ref={scrollRef}>
                <div className="flex justify-center mb-6">
                  <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-muted-foreground shadow-sm">
                    Hari ini
                  </div>
                </div>
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const isOwn = msg.sender === 'doctor'
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`relative max-w-[75%] px-3 py-2 text-[15px] shadow-sm ${
                            isOwn
                              ? 'bg-[#d9fdd3] dark:bg-emerald-900 text-foreground rounded-lg rounded-tr-none'
                              : 'bg-card text-foreground rounded-lg rounded-tl-none'
                          }`}
                        >
                          {/* Bubble Tail */}
                          <div className={`absolute top-0 w-3 h-3 ${isOwn ? '-right-2 text-[#d9fdd3] dark:text-emerald-900' : '-left-2 text-card'}`}>
                            <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                              {isOwn ? (
                                <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
                              ) : (
                                <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
                              )}
                            </svg>
                          </div>
                          
                          <div className="flex flex-col">
                            <span>{msg.text}</span>
                            <div className={`flex items-center justify-end gap-1 text-[11px] mt-1 -mb-1 ${
                                isOwn ? 'text-emerald-700 dark:text-emerald-200' : 'text-muted-foreground'
                              }`}
                            >
                              <span>{msg.time}</span>
                              {isOwn && (
                                <CheckCheck className={`h-3.5 w-3.5 ${msg.isRead ? 'text-blue-500' : ''}`} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Chat Input */}
              <div className="bg-card p-3 flex items-center gap-2 border-t border-border z-10 relative">
                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-muted shrink-0">
                  <Smile className="h-6 w-6" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-muted shrink-0">
                  <Paperclip className="h-5 w-5" />
                </Button>
                
                <form
                  onSubmit={handleSendMessage}
                  className="flex-1 flex items-center"
                >
                  <Input
                    placeholder="Ketik pesan untuk pasien..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-lg border-0 bg-muted/50 px-4 py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </form>

                {newMessage.trim() ? (
                  <Button onClick={() => handleSendMessage()} size="icon" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 ml-1 h-10 w-10">
                    <Send className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button type="button" variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-muted shrink-0 ml-1 h-10 w-10">
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
