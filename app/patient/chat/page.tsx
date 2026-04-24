'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Search, Phone, Video, MoreVertical, Paperclip, ImageIcon } from 'lucide-react'
import { mockChatRooms, mockChatMessages, mockUsers } from '@/lib/mock-data'
import { useAuthStore, useAppStore } from '@/lib/store'

export default function PatientChatPage() {
  const { user } = useAuthStore()
  const { sendMessage, getMessagesBetweenUsers } = useAppStore()
  const [selectedChat, setSelectedChat] = useState<string | null>(mockChatRooms[0]?.id || null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter((n) => !n.startsWith('Dr'))
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const selectedRoom = mockChatRooms.find((room) => room.id === selectedChat)
  const otherParticipant = selectedRoom?.participants.find((p) => p.id !== user?.id)
  
  const messages = selectedRoom
    ? getMessagesBetweenUsers(user?.id || '', otherParticipant?.id || '')
    : []

  const handleSendMessage = () => {
    if (!newMessage.trim() || !otherParticipant || !user) return
    
    sendMessage({
      senderId: user.id,
      receiverId: otherParticipant.id,
      content: newMessage.trim(),
      type: 'text',
    })
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="patient" />
      <DashboardHeader role="patient" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Pesan</h1>

          <Card className="flex h-[calc(100vh-200px)] overflow-hidden">
            <div className="w-80 border-r border-border">
              <div className="border-b border-border p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari percakapan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(100%-73px)]">
                {mockChatRooms.map((room) => {
                  const participant = room.participants.find((p) => p.id !== user?.id)
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedChat(room.id)}
                      className={`flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50 ${
                        selectedChat === room.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {participant ? getInitials(participant.name) : '?'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground truncate">
                            {participant?.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {room.lastMessage && formatTime(room.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {room.lastMessage?.content}
                        </p>
                      </div>
                      {room.unreadCount > 0 && (
                        <Badge className="h-5 w-5 rounded-full p-0 text-xs">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </ScrollArea>
            </div>

            <div className="flex flex-1 flex-col">
              {selectedRoom && otherParticipant ? (
                <>
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(otherParticipant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {otherParticipant.name}
                        </h3>
                        <p className="text-xs text-green-600">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {mockChatMessages.map((message) => {
                        const isOwn = message.senderId === user?.id
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-foreground'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`mt-1 text-right text-xs ${
                                  isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>

                  <div className="border-t border-border p-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                      }}
                      className="flex items-center gap-2"
                    >
                      <Button type="button" variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Tulis pesan..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-muted-foreground">
                  Pilih percakapan untuk memulai chat
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
