'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Send, Phone, Video, Info } from 'lucide-react'

const initialChats = [
  { id: 'p1', name: 'Budi Santoso', lastMessage: 'Dokter, obatnya sudah habis.', time: '10:30', unread: 2 },
  { id: 'p2', name: 'Siti Aminah', lastMessage: 'Terima kasih banyak, Dok.', time: 'Kemarin', unread: 0 },
  { id: 'p3', name: 'Andi Pratama', lastMessage: 'Apakah saya boleh makan pedas?', time: 'Kemarin', unread: 0 },
]

const initialMessages = [
  { id: 'm1', sender: 'doctor', text: 'Halo Pak Budi, bagaimana kabarnya hari ini?', time: '10:00' },
  { id: 'm2', sender: 'patient', text: 'Masih agak pusing Dok, tapi tensi sudah turun.', time: '10:05' },
  { id: 'm3', sender: 'doctor', text: 'Bagus. Obatnya tolong dihabiskan ya.', time: '10:10' },
  { id: 'm4', sender: 'patient', text: 'Baik Dok.', time: '10:15' },
  { id: 'm5', sender: 'patient', text: 'Dokter, obatnya sudah habis.', time: '10:30' },
]

export default function DoctorChatPage() {
  const [chats] = useState(initialChats)
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [activeChat, setActiveChat] = useState(chats[0])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: `m${Date.now()}`,
      sender: 'doctor',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Pesan</h1>
            <p className="text-muted-foreground">
              Konsultasi langsung dengan pasien Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari pasien..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      activeChat.id === chat.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(chat.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-sm font-semibold truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-2 h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getInitials(activeChat.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{activeChat.name}</h2>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-600"></span> Online
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Info className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                <div className="text-center">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">Hari ini</span>
                </div>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'doctor' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-white border border-border text-foreground rounded-bl-sm'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 mx-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border bg-card">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Ketik pesan untuk pasien..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
