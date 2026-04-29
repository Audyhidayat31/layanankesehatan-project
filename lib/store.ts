import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  User,
  DoctorProfile,
  Appointment,
  Order,
  Medicine,
  ChatMessage,
  Notification,
  OrderItem,
} from './types'
import {
  mockUsers,
  mockDoctors,
  mockPatients,
  mockPharmacies,
  mockMedicines,
  mockAppointments,
  mockOrders,
  mockChatMessages,
  mockTransactions,
  mockNotifications,
} from './mock-data'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  registeredUsers: User[]
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { name: string; email: string; password: string; role: string }) => Promise<{ success: boolean; error?: string }>
  updatePassword: (userId: string, newPassword: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: mockUsers,
      login: async (email: string, password?: string) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          const json = await res.json()
          
          if (!res.ok) {
            // Jika error dari server (DB tidur) lanjut ke fallback lokal
            if (res.status === 500) throw new Error('Database unreachable')
            return { success: false, error: json.error || 'Email atau password salah' }
          }
          
          const user = json.user
          set({ 
            user, 
            isAuthenticated: true,
            registeredUsers: [...get().registeredUsers.filter(u => u.email !== user.email), user]
          })
          return { success: true }
        } catch (err) {
          // Fallback lokal jika database Neon mati
          const user = get().registeredUsers.find((u) => u.email === email)
          if (user) {
            const userPassword = user.password || 'demo'
            if (userPassword === password) {
              set({ user, isAuthenticated: true })
              return { success: true }
            }
          }
          return { success: false, error: 'Email atau password salah' }
        }
      },
      register: async (data) => {
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          const json = await res.json()
          
          if (!res.ok) {
            if (res.status === 500) throw new Error('Database unreachable')
            return { success: false, error: json.error || 'Email sudah terdaftar' }
          }
          
          const newUser = json.user
          set({ 
            registeredUsers: [...get().registeredUsers.filter(u => u.email !== newUser.email), newUser],
            user: newUser, 
            isAuthenticated: true 
          })
          return { success: true }
        } catch (err) {
          // Fallback lokal jika database Neon mati
          const exists = get().registeredUsers.find((u) => u.email === data.email)
          if (exists) {
            return { success: false, error: 'Email sudah terdaftar' }
          }
          const newUser: User = {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            role: data.role as User['role'],
            password: data.password,
            createdAt: new Date().toISOString(),
          }
          set({ 
            registeredUsers: [...get().registeredUsers, newUser],
            user: newUser, 
            isAuthenticated: true 
          })
          return { success: true }
        }
      },
      updatePassword: (userId: string, newPassword: string) => {
        const registeredUsers = get().registeredUsers.map((u) => 
          u.id === userId ? { ...u, password: newPassword } : u
        )
        const currentUser = get().user
        set({ 
          registeredUsers, 
          user: currentUser?.id === userId ? { ...currentUser, password: newPassword } : currentUser 
        })
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)

interface CartItem {
  medicine: Medicine
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (medicine: Medicine, quantity?: number) => void
  removeItem: (medicineId: string) => void
  updateQuantity: (medicineId: string, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (medicine, quantity = 1) => {
        const items = get().items
        const existingItem = items.find((item) => item.medicine.id === medicine.id)
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.medicine.id === medicine.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ items: [...items, { medicine, quantity }] })
        }
      },
      removeItem: (medicineId) => {
        set({ items: get().items.filter((item) => item.medicine.id !== medicineId) })
      },
      updateQuantity: (medicineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(medicineId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.medicine.id === medicineId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.medicine.price * item.quantity,
          0
        )
      },
    }),
    { name: 'cart-storage' }
  )
)

interface AppState {
  doctors: DoctorProfile[]
  appointments: Appointment[]
  orders: Order[]
  medicines: Medicine[]
  chatMessages: ChatMessage[]
  notifications: Notification[]
  
  // Doctor actions
  getDoctors: () => DoctorProfile[]
  getDoctorById: (id: string) => DoctorProfile | undefined
  
  // Appointment actions
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment
  updateAppointmentStatus: (id: string, status: Appointment['status'], diagnosis?: string, notes?: string) => void
  getAppointmentsByPatient: (patientId: string) => Appointment[]
  getAppointmentsByDoctor: (doctorId: string) => Appointment[]
  
  // Order actions
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order
  updateOrderStatus: (id: string, status: Order['status']) => void
  getOrdersByPatient: (patientId: string) => Order[]
  getOrdersByPharmacy: (pharmacyId: string) => Order[]
  
  // Medicine actions
  getMedicines: () => Medicine[]
  getMedicineById: (id: string) => Medicine | undefined
  updateMedicineStock: (id: string, stock: number) => void
  
  // Chat actions
  sendMessage: (message: Omit<ChatMessage, 'id' | 'createdAt' | 'isRead'>) => Promise<ChatMessage>
  getMessagesBetweenUsers: (userId1: string, userId2: string) => ChatMessage[]
  fetchMessages: (userId1: string, userId2: string) => Promise<void>
  markMessagesAsRead: (senderId: string, receiverId: string) => void
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationRead: (id: string) => void
  getUnreadCount: (userId: string) => number
  refreshData: (userId: string, role: string) => Promise<void>
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      doctors: mockDoctors,
      appointments: mockAppointments,
      orders: mockOrders,
      medicines: mockMedicines,
      chatMessages: mockChatMessages,
      notifications: mockNotifications,
      
      getDoctors: () => get().doctors,
      getDoctorById: (id) => get().doctors.find((d) => d.id === id),
      
      createAppointment: async (appointmentData) => {
        try {
          const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
          })
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            const json = await res.json()
            if (json.success) {
              set({ appointments: [...get().appointments, json.appointment] })
              return json.appointment
            }
          } else {
            console.warn('Backend unavailable, using local fallback. Status:', res.status)
          }
        } catch (err) {
          console.warn('Backend unavailable, using local fallback:', err)
        }
        // Fallback
        const newAppointment: Appointment = {
          ...appointmentData,
          id: `apt-${Date.now()}`,
          createdAt: new Date().toISOString(),
        } as any
        set({ appointments: [...get().appointments, newAppointment] })
        return newAppointment as any
      },
      
      updateAppointmentStatus: async (id, status, diagnosis, notes) => {
        try {
          const res = await fetch(`/api/appointments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, diagnosis, notes })
          })
          if (res.ok) {
            set({
              appointments: get().appointments.map((apt) =>
                apt.id === id ? { ...apt, status, diagnosis, notes } : apt
              ),
            })
            return
          }
        } catch (err) {
          console.error('Store updateAppointmentStatus error:', err)
        }
        
        set({
          appointments: get().appointments.map((apt) =>
            apt.id === id ? { ...apt, status, diagnosis, notes } : apt
          ),
        })
      },
      
      getAppointmentsByPatient: (patientId) => {
        return get().appointments.filter((apt) => apt.patientId === patientId)
      },
      
      getAppointmentsByDoctor: (doctorId) => {
        return get().appointments.filter((apt) => apt.doctorId === doctorId)
      },
      
      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ord-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ orders: [...get().orders, newOrder] })
        return newOrder
      },
      
      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })
      },
      
      getOrdersByPatient: (patientId) => {
        return get().orders.filter((order) => order.patientId === patientId)
      },
      
      getOrdersByPharmacy: (pharmacyId) => {
        return get().orders.filter((order) => order.pharmacyId === pharmacyId)
      },
      
      getMedicines: () => get().medicines,
      getMedicineById: (id) => get().medicines.find((m) => m.id === id),
      
      updateMedicineStock: (id, stock) => {
        set({
          medicines: get().medicines.map((med) =>
            med.id === id ? { ...med, stock } : med
          ),
        })
      },
      
      sendMessage: async (messageData) => {
        try {
          const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
          })
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            const json = await res.json()
            if (json.success) {
              set({ chatMessages: [...get().chatMessages, json.message] })
              return json.message
            }
          } else {
            console.warn('Backend unavailable, using local fallback. Status:', res.status)
          }
        } catch (err) {
          console.warn('Backend unavailable, using local fallback:', err)
        }

        const newMessage: ChatMessage = {
          ...messageData,
          id: `msg-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        }
        set({ chatMessages: [...get().chatMessages, newMessage] })
        return newMessage
      },
      
      getMessagesBetweenUsers: (userId1, userId2) => {
        return get().chatMessages.filter(
          (msg) =>
            (msg.senderId === userId1 && msg.receiverId === userId2) ||
            (msg.senderId === userId2 && msg.receiverId === userId1)
        ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      },
      
      fetchMessages: async (userId1, userId2) => {
        try {
          const res = await fetch(`/api/messages?userId1=${userId1}&userId2=${userId2}`)
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            const json = await res.json()
            if (json.success) {
              const currentMessages = get().chatMessages
              // Merge unique messages
              const newMessages = json.messages.filter(
                (nm: any) => !currentMessages.some((cm) => cm.id === nm.id)
              )
              if (newMessages.length > 0) {
                set({ chatMessages: [...currentMessages, ...newMessages] })
              }
            }
          }
        } catch (err) {
          // Silent catch to prevent error overlays if backend is not running
        }
      },
      
      markMessagesAsRead: (senderId, receiverId) => {
        set({
          chatMessages: get().chatMessages.map((msg) =>
            msg.senderId === senderId && msg.receiverId === receiverId
              ? { ...msg, isRead: true }
              : msg
          ),
        })
      },
      
      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ notifications: [...get().notifications, newNotification] })
      },
      
      markNotificationRead: (id) => {
        set({
          notifications: get().notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          ),
        })
      },
      
      getUnreadCount: (userId) => {
        return get().notifications.filter(
          (notif) => notif.userId === userId && !notif.isRead
        ).length
      },
      
      refreshData: async (userId, role) => {
        try {
          const [aptRes, msgRes] = await Promise.all([
            fetch(`/api/appointments?userId=${userId}&role=${role}`),
            // Fetching messages is harder because it needs another userId. 
            // For now let's just refresh appointments.
          ])
          
          if (aptRes.ok && aptRes.headers.get('content-type')?.includes('application/json')) {
            const aptJson = await aptRes.json()
            if (aptJson.success) {
              const currentAppointments = get().appointments;
              const dbAppointments = aptJson.appointments;
              
              // Merge dbAppointments into currentAppointments
              const merged = [...currentAppointments];
              dbAppointments.forEach((dbApt: any) => {
                const idx = merged.findIndex((a) => a.id === dbApt.id);
                if (idx >= 0) {
                  merged[idx] = dbApt;
                } else {
                  merged.push(dbApt);
                }
              });
              set({ appointments: merged })
            }
          }
        } catch (err) {
          // Silent catch to prevent error overlays if backend is not running
        }
      },
    }),
    { name: 'app-storage' }
  )
)

// Export mock data for direct access
export { mockUsers, mockDoctors, mockPatients, mockPharmacies, mockMedicines, mockAppointments, mockOrders, mockTransactions }
