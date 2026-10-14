export type TenantType = 'medical' | 'dental' | 'salon' | 'auto' | 'fitness';

export type UserRole = 'patient' | 'receptionist' | 'doctor' | 'admin' | 'superadmin';

export type SpaceType = 'patient' | 'reception' | 'doctor' | 'clinic_admin' | 'saas_superadmin';

export type ThemeMode = 'dark' | 'light';

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  type: TenantType;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo: string;
  accentColor: string;
  currency: string;
  timezone: string;
  requireDeposit: boolean;
  defaultDepositAmount: number;
  paymentMethods: ('on_site' | 'wave' | 'orange_money' | 'free_money')[];
  openingHours: {
    days: string[];
    start: string;
    end: string;
    breakStart?: string;
    breakEnd?: string;
    fridayPrayerStart?: string;
    fridayPrayerEnd?: string;
  };
}

export interface Practitioner {
  id: string;
  tenantId: string;
  name: string;
  title: string;
  specialty: string;
  avatar: string;
  phone: string;
  email: string;
  room: string;
  availableDays: number[]; // 1 = Monday, 7 = Sunday
}

export interface MedicalService {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceXOF: number;
  depositRequired: boolean;
  depositAmountXOF: number;
  description: string;
  practitionerIds: string[];
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'pending' | 'deposit_paid' | 'fully_paid';
export type PaymentMethod = 'on_site' | 'wave' | 'orange_money' | 'free_money';

export interface Appointment {
  id: string;
  reference: string;
  tenantId: string;
  practitionerId: string;
  serviceId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountXOF: number;
  depositPaidXOF: number;
  source: 'online' | 'receptionist_phone' | 'receptionist_walkin';
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  appointmentId: string;
  recipientPhone: string;
  channel: 'whatsapp' | 'sms';
  type: 'confirmation' | 'reminder_24h' | 'reminder_2h' | 'cancellation';
  messageFr: string;
  messageWolof: string;
  sentAt: string;
  status: 'delivered' | 'sent' | 'pending';
}

export interface Holiday {
  id: string;
  name: string;
  nameWolof?: string;
  date: string;
  type: 'religious_muslim' | 'religious_christian' | 'civil';
  isOpen: boolean;
}
