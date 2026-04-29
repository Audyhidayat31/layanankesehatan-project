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
import { mockChatRooms, mockUsers } from '@/lib/mock-data'
import { useAuthStore, useAppStore } from '@/lib/store'

export default function DoctorChatPage() {
  const { user, registeredUsers } = useAuthStore()
  // Default to 'user-2' (Dr. Sarah) if not logged in
  const currentUserId = user?.id || 'user-2'
  
  const { sendMessage, getMessagesBetweenUsers, markMessagesAsRead, chatMessages, appointments, getDoctors, fetchMessages } = useAppStore()
  
  const doctorProfile = getDoctors().find(d => d.userId === currentUserId)
  const doctorId = doctorProfile?.id || 'doc-1'
  
  const patientIdsFromMessages = chatMessages
    .filter(m => m.senderId === currentUserId || m.receiverId === currentUserId)
    .map(m => m.senderId === currentUserId ? m.receiverId : m.senderId)
    
  const patientIdsFromAppointments = appointments
    .filter(a => a.doctorId === doctorId)
    .map(a => a.patient.userId)
    
  const uniquePatientIds = Array.from(new Set([...patientIdsFromMessages, ...patientIdsFromAppointments]))
  
  const doctorRooms = uniquePatientIds.map(patientId => {
    const patientUser = registeredUsers.find(u => u.id === patientId)
    const currentUserProfile = registeredUsers.find(u => u.id === currentUserId)
    return {
      id: `room-${patientId}`,
      participants: patientUser && currentUserProfile ? [patientUser, currentUserProfile] : []
    }
  }).filter(r => r.participants.length > 0)
  
  const [selectedChat, setSelectedChat] = useState<string | null>(doctorRooms.length > 0 ? doctorRooms[0].id : null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter((n) => !n.startsWith('Dr.'))
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const selectedRoom = doctorRooms.find((room) => room.id === selectedChat)
  const otherParticipant = selectedRoom?.participants.find((p) => p.id !== currentUserId)
  
  const messages = selectedRoom
    ? getMessagesBetweenUsers(currentUserId, otherParticipant?.id || '')
    : []

  // Menandai pesan sebagai terbaca ketika chat dibuka atau ada pesan baru
  useEffect(() => {
    if (otherParticipant?.id) {
      markMessagesAsRead(otherParticipant.id, currentUserId)
    }
  }, [selectedChat, messages.length, otherParticipant?.id, currentUserId, markMessagesAsRead])

  useEffect(() => {
    if (otherParticipant?.id) {
      fetchMessages(currentUserId, otherParticipant.id)
      
      const interval = setInterval(() => {
        fetchMessages(currentUserId, otherParticipant.id)
      }, 3000) // Poll every 3 seconds
      
      return () => clearInterval(interval)
    }
  }, [selectedChat, otherParticipant?.id, currentUserId, fetchMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !otherParticipant) return
    
    sendMessage({
      senderId: currentUserId,
      receiverId: otherParticipant.id,
      content: newMessage.trim(),
      type: 'text',
    })
    setNewMessage('')
  }

  const filteredRooms = doctorRooms.filter(room => {
    const participant = room.participants.find((p) => p.id !== currentUserId)
    return participant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="doctor" />
      <DashboardHeader role="doctor" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <Card className="flex flex-row p-0 gap-0 h-[calc(100vh-140px)] overflow-hidden shadow-md border-muted">
            {/* Sidebar Chat List */}
            <div className="w-80 border-r border-border bg-card flex flex-col">
              <div className="bg-muted/30 p-3 flex items-center justify-between border-b border-border h-16">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={registeredUsers.find(u => u.id === currentUserId)?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(registeredUsers.find(u => u.id === currentUserId)?.name || 'ME')}
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
                {filteredRooms.map((room) => {
                  const participant = room.participants.find((p) => p.id !== currentUserId)
                  
                  // Menghitung jumlah pesan yang belum dibaca dari pasien ini
                  const unreadCount = getMessagesBetweenUsers(currentUserId, participant?.id || '').filter(
                    (msg) => msg.senderId === participant?.id && !msg.isRead
                  ).length

                  // Mendapatkan pesan terakhir
                  const roomMessages = getMessagesBetweenUsers(currentUserId, participant?.id || '')
                  const lastMessage = roomMessages.length > 0 ? roomMessages[roomMessages.length - 1] : null

                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedChat(room.id)}
                      className={`flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50 ${
                        selectedChat === room.id ? 'bg-muted' : ''
                      }`}
                    >
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src={participant?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {participant ? getInitials(participant.name) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden border-b border-border/50 pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground truncate text-sm">
                            {participant?.name}
                          </h4>
                          <span className={`text-xs ${unreadCount > 0 ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                            {lastMessage ? formatTime(lastMessage.createdAt) : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm text-muted-foreground">
                            {lastMessage?.senderId === currentUserId && (
                              <CheckCheck className={`inline-block h-3 w-3 mr-1 ${lastMessage.isRead ? 'text-blue-500' : 'text-muted-foreground'}`} />
                            )}
                            {lastMessage?.content || 'Belum ada pesan'}
                          </p>
                          {unreadCount > 0 && (
                            <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-emerald-500 text-white text-[10px] shrink-0">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex flex-1 flex-col bg-[#efeae2] dark:bg-muted/10 relative">
              <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")', backgroundRepeat: 'repeat' }}></div>
              
              {selectedRoom && otherParticipant ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between bg-card p-3 border-b border-border h-16 z-10 relative">
                    <div className="flex items-center gap-3 cursor-pointer">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipant.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(otherParticipant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {otherParticipant.name}
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
                      {messages.map((message) => {
                        const isOwn = message.senderId === currentUserId
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`relative max-w-[75%] px-3 py-2 text-[15px] shadow-sm ${
                                isOwn
                                  ? 'bg-[#d9fdd3] dark:bg-emerald-900 text-foreground rounded-lg rounded-tr-none'
                                  : 'bg-card text-foreground rounded-lg rounded-tl-none'
                              }`}
                            >
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
                                <span>{message.content}</span>
                                <div className={`flex items-center justify-end gap-1 text-[11px] mt-1 -mb-1 ${
                                    isOwn ? 'text-emerald-700 dark:text-emerald-200' : 'text-muted-foreground'
                                  }`}
                                >
                                  <span>{formatTime(message.createdAt)}</span>
                                  {isOwn && (
                                    <CheckCheck className={`h-3.5 w-3.5 ${message.isRead ? 'text-blue-500' : ''}`} />
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
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                      }}
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
                      <Button onClick={handleSendMessage} size="icon" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 ml-1 h-10 w-10">
                        <Send className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button type="button" variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-muted shrink-0 ml-1 h-10 w-10">
                        <Mic className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center z-10 relative">
                  <div className="bg-card/80 p-6 rounded-full mb-6">
                    <Phone className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                  <h2 className="text-xl font-medium text-foreground mb-2">HealthServices Web</h2>
                  <p className="text-muted-foreground text-sm text-center max-w-md">
                    Pilih pasien dari daftar di sebelah kiri untuk mulai mengirim pesan.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
