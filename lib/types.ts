export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  createdAt: string
}

export interface DoctorProfile {
  id: string
  userId: string
  user: User
  specialization: string
  hospital: string
  experience: number
  rating: number
  reviewCount: number
  price: number
  bio: string
  education: string[]
  availableSlots: TimeSlot[]
  isVerified: boolean
  isOnline: boolean
}

export interface PharmacyProfile {
  id: string
  userId: string
  user: User
  name: string
  address: string
  city: string
  phone: string
  operatingHours: string
  isVerified: boolean
  isOpen: boolean
  rating: number
  reviewCount: number
}

export interface PatientProfile {
  id: string
  userId: string
  user: User
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  bloodType?: string
  allergies?: string[]
  medicalHistory?: string[]
  address?: string
}

export interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export interface Appointment {
  id: string
  patientId: string
  patient: PatientProfile
  doctorId: string
  doctor: DoctorProfile
  date: string
  time: string
  type: 'online' | 'offline'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  complaint?: string
  diagnosis?: string
  prescription?: Prescription
  notes?: string
  createdAt: string
}

export interface Medicine {
  id: string
  name: string
  genericName: string
  description: string
  category: string
  price: number
  stock: number
  unit: string
  requiresPrescription: boolean
  image?: string
  pharmacyId: string
  pharmacy?: PharmacyProfile
}

export interface Prescription {
  id: string
  appointmentId: string
  doctorId: string
  patientId: string
  medicines: PrescriptionItem[]
  instructions: string
  createdAt: string
}

export interface PrescriptionItem {
  medicineId: string
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  quantity: number
}

export interface Order {
  id: string
  patientId: string
  patient?: PatientProfile
  pharmacyId: string
  pharmacy?: PharmacyProfile
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: string
}

export interface OrderItem {
  medicineId: string
  medicine: Medicine
  quantity: number
  price: number
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'file'
  createdAt: string
  isRead: boolean
}

export interface ChatRoom {
  id: string
  appointmentId?: string
  participants: User[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'appointment' | 'order'
  referenceId: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'appointment' | 'order' | 'chat' | 'system'
  isRead: boolean
  createdAt: string
}
