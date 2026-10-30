import { Tenant, Practitioner, MedicalService, Appointment, Holiday, NotificationLog, MessageTemplate } from '../types';

export const tenants: Tenant[] = [
  {
    id: 't-1',
    slug: 'clinique-keur-madior',
    name: 'Clinique Keur Madior',
    type: 'medical',
    tagline: 'Centre Médical & Chirurgical pluridisciplinaire d’excellence',
    address: 'Route des Almadies, en face de la Brioche Dorée',
    city: 'Dakar',
    phone: '+221 33 820 12 34',
    email: 'contact@keurmadior.sn',
    logo: '🏥',
    accentColor: '#059669', // Emerald
    currency: 'FCFA',
    timezone: 'Africa/Dakar',
    requireDeposit: true,
    defaultDepositAmount: 5000,
    paymentMethods: ['on_site', 'wave', 'orange_money', 'free_money'],
    openingHours: {
      days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      start: '08:30',
      end: '18:00',
      breakStart: '13:00',
      breakEnd: '14:00',
      fridayPrayerStart: '13:00',
      fridayPrayerEnd: '15:00',
    },
  },
  {
    id: 't-2',
    slug: 'cabinet-dentaire-teranga',
    name: 'Cabinet Dentaire Téranga',
    type: 'dental',
    tagline: 'Soins dentaires modernes, implantologie & esthétique du sourire',
    address: '45 Avenue Georges Pompidou (Ponty)',
    city: 'Dakar Plateau',
    phone: '+221 33 821 55 66',
    email: 'rdv@dentaireteranga.sn',
    logo: '🦷',
    accentColor: '#0284c7', // Sky
    currency: 'FCFA',
    timezone: 'Africa/Dakar',
    requireDeposit: false,
    defaultDepositAmount: 0,
    paymentMethods: ['on_site', 'wave', 'orange_money'],
    openingHours: {
      days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
      start: '09:00',
      end: '17:30',
      breakStart: '13:00',
      breakEnd: '14:00',
      fridayPrayerStart: '13:00',
      fridayPrayerEnd: '15:00',
    },
  },
  {
    id: 't-3',
    slug: 'institut-beaute-ngor',
    name: 'Institut & Spa Ébène Ngor',
    type: 'salon',
    tagline: 'Coiffure mixte, esthétique, tresses traditionnelles et soins spa',
    address: 'Corniche des Almadies, Virage Ngor',
    city: 'Dakar',
    phone: '+221 77 500 88 99',
    email: 'spa@ebene-ngor.sn',
    logo: '✨',
    accentColor: '#d97706', // Amber
    currency: 'FCFA',
    timezone: 'Africa/Dakar',
    requireDeposit: true,
    defaultDepositAmount: 3000,
    paymentMethods: ['on_site', 'wave', 'orange_money'],
    openingHours: {
      days: ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      start: '10:00',
      end: '20:00',
      breakStart: '14:00',
      breakEnd: '15:00',
    },
  },
];

export const practitioners: Practitioner[] = [
  {
    id: 'p-1',
    tenantId: 't-1',
    name: 'Dr. Fatou Ndiaye',
    title: 'Docteur',
    specialty: 'Médecine Générale & Diabétologie',
    avatar: 'https://images.unsplash.com/photo-1594824813589-9831a3d90f84?auto=format&fit=crop&w=400&q=80',
    phone: '+221 77 645 12 90',
    email: 'f.ndiaye@keurmadior.sn',
    room: 'Bureau 102 - 1er étage',
    availableDays: [1, 2, 3, 4, 5],
  },
  {
    id: 'p-2',
    tenantId: 't-1',
    name: 'Dr. Cheikh Oumar Fall',
    title: 'Dr.',
    specialty: 'Pédiatrie & Santé Néonatale',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    phone: '+221 78 123 45 67',
    email: 'c.fall@keurmadior.sn',
    room: 'Bureau 105 - RDC Pédiatrie',
    availableDays: [1, 2, 3, 5, 6],
  },
  {
    id: 'p-3',
    tenantId: 't-1',
    name: 'Dr. Aïssatou Ba',
    title: 'Pr.',
    specialty: 'Cardiologie & Hypertension',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    phone: '+221 76 890 12 34',
    email: 'a.ba@keurmadior.sn',
    room: 'Bureau 201 - 2ème étage',
    availableDays: [2, 4, 6],
  },
  {
    id: 'p-4',
    tenantId: 't-2',
    name: 'Dr. Mamadou Sow',
    title: 'Chirurgien-Dentiste',
    specialty: 'Implantologie & Soins Conservateurs',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    phone: '+221 70 334 55 66',
    email: 'm.sow@dentaireteranga.sn',
    room: 'Fauteuil 1 - Plateau',
    availableDays: [1, 2, 3, 4, 5],
  },
];

export const services: MedicalService[] = [
  {
    id: 's-1',
    tenantId: 't-1',
    name: 'Consultation Médecine Générale',
    category: 'Médecine Générale',
    durationMinutes: 30,
    priceXOF: 15000,
    depositRequired: true,
    depositAmountXOF: 5000,
    description: 'Bilan complet, ordonnance, prise de tension et diagnostic général.',
    practitionerIds: ['p-1'],
  },
  {
    id: 's-2',
    tenantId: 't-1',
    name: 'Consultation Pédiatrique',
    category: 'Pédiatrie',
    durationMinutes: 30,
    priceXOF: 20000,
    depositRequired: true,
    depositAmountXOF: 5000,
    description: 'Suivi de croissance du nourrisson, vaccinations, pathologies pédiatriques.',
    practitionerIds: ['p-2'],
  },
  {
    id: 's-3',
    tenantId: 't-1',
    name: 'Consultation Cardiologie & ECG',
    category: 'Cardiologie',
    durationMinutes: 45,
    priceXOF: 30000,
    depositRequired: true,
    depositAmountXOF: 10000,
    description: 'Avis spécialisé cardiologique complet avec électrocardiogramme de repos.',
    practitionerIds: ['p-3'],
  },
  {
    id: 's-4',
    tenantId: 't-1',
    name: 'Échographie Abdomino-pelvienne',
    category: 'Imagerie',
    durationMinutes: 30,
    priceXOF: 25000,
    depositRequired: true,
    depositAmountXOF: 10000,
    description: 'Examen échographique haute résolution avec compte-rendu imprimé immédiat.',
    practitionerIds: ['p-1', 'p-3'],
  },
  {
    id: 's-5',
    tenantId: 't-2',
    name: 'Détartrage & Polissage Dentaire',
    category: 'Hygiène Dentaire',
    durationMinutes: 40,
    priceXOF: 25000,
    depositRequired: false,
    depositAmountXOF: 0,
    description: 'Élimination ultrasonique du tartre, polissage antitache et contrôle bucco-dentaire.',
    practitionerIds: ['p-4'],
  },
  {
    id: 's-6',
    tenantId: 't-2',
    name: 'Consultation Urgence Mal de Dent',
    category: 'Urgences',
    durationMinutes: 30,
    priceXOF: 20000,
    depositRequired: false,
    depositAmountXOF: 0,
    description: 'Soulagement immédiat de la douleur pulpaire et cliché rétro-alvéolaire.',
    practitionerIds: ['p-4'],
  },
];

export const senegalHolidays: Holiday[] = [
  { id: 'h-1', name: 'Jour de l’An', date: '2026-01-01', type: 'civil', isOpen: false },
  { id: 'h-2', name: 'Fête de l’Indépendance du Sénégal', nameWolof: 'Bésu Temme ci Sénégal', date: '2026-04-04', type: 'civil', isOpen: false },
  { id: 'h-3', name: 'Lundi de Pâques', date: '2026-04-06', type: 'religious_christian', isOpen: false },
  { id: 'h-4', name: 'Fête du Travail', date: '2026-05-01', type: 'civil', isOpen: false },
  { id: 'h-5', name: 'Korité (Aïd el-Fitr)', nameWolof: 'Korité', date: '2026-03-21', type: 'religious_muslim', isOpen: false },
  { id: 'h-6', name: 'Tabaski (Aïd el-Kébir)', nameWolof: 'Tabaski', date: '2026-05-28', type: 'religious_muslim', isOpen: false },
  { id: 'h-7', name: 'Tamkharit (Achoura)', nameWolof: 'Tamxarit', date: '2026-06-26', type: 'religious_muslim', isOpen: false },
  { id: 'h-8', name: 'Grand Magal de Touba', nameWolof: 'Magaalu Tuubaa', date: '2026-08-31', type: 'religious_muslim', isOpen: false },
  { id: 'h-9', name: 'Gamou (Maouloud)', nameWolof: 'Gàmmu', date: '2026-09-04', type: 'religious_muslim', isOpen: false },
  { id: 'h-10', name: 'Fête de la Toussaint', date: '2026-11-01', type: 'religious_christian', isOpen: false },
  { id: 'h-11', name: 'Noël', date: '2026-12-25', type: 'religious_christian', isOpen: false },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    reference: 'SN-RDV-2601',
    tenantId: 't-1',
    practitionerId: 'p-1',
    serviceId: 's-1',
    patientName: 'Moussa Diop',
    patientPhone: '+221 77 450 12 34',
    date: '2026-09-30',
    timeSlot: '09:00',
    status: 'arrived',
    paymentMethod: 'wave',
    paymentStatus: 'deposit_paid',
    amountXOF: 15000,
    depositPaidXOF: 5000,
    source: 'online',
    notes: 'Contrôle tension artérielle & renouvellement ordonnance.',
    reminderSent: true,
    createdAt: '2026-09-29 14:20',
  },
  {
    id: 'apt-2',
    reference: 'SN-RDV-2602',
    tenantId: 't-1',
    practitionerId: 'p-1',
    serviceId: 's-4',
    patientName: 'Mariama Seydou Sow',
    patientPhone: '+221 78 610 88 44',
    date: '2026-09-30',
    timeSlot: '09:45',
    status: 'confirmed',
    paymentMethod: 'orange_money',
    paymentStatus: 'deposit_paid',
    amountXOF: 25000,
    depositPaidXOF: 10000,
    source: 'online',
    notes: 'Échographie de contrôle prescrite par Dr. Ba.',
    reminderSent: true,
    createdAt: '2026-09-29 16:05',
  },
  {
    id: 'apt-3',
    reference: 'SN-RDV-2603',
    tenantId: 't-1',
    practitionerId: 'p-2',
    serviceId: 's-2',
    patientName: 'Bébé Cheikh Tidiane Ndao (Mère: Aminata Sy)',
    patientPhone: '+221 76 345 77 88',
    date: '2026-09-30',
    timeSlot: '10:30',
    status: 'in_progress',
    paymentMethod: 'on_site',
    paymentStatus: 'pending',
    amountXOF: 20000,
    depositPaidXOF: 0,
    source: 'receptionist_phone',
    notes: 'Fièvre modérée depuis 48h, prise au téléphone par la secrétaire.',
    reminderSent: true,
    createdAt: '2026-09-30 08:15',
  },
  {
    id: 'apt-4',
    reference: 'SN-RDV-2604',
    tenantId: 't-1',
    practitionerId: 'p-1',
    serviceId: 's-1',
    patientName: 'Babacar Cissé',
    patientPhone: '+221 70 811 22 33',
    date: '2026-09-30',
    timeSlot: '11:15',
    status: 'pending',
    paymentMethod: 'wave',
    paymentStatus: 'deposit_paid',
    amountXOF: 15000,
    depositPaidXOF: 5000,
    source: 'online',
    notes: 'Certificat médical de non contre-indication au sport.',
    reminderSent: false,
    createdAt: '2026-09-30 08:40',
  },
  {
    id: 'apt-5',
    reference: 'SN-RDV-2605',
    tenantId: 't-1',
    practitionerId: 'p-3',
    serviceId: 's-3',
    patientName: 'El Hadji Malick Kane',
    patientPhone: '+221 75 990 00 11',
    date: '2026-09-30',
    timeSlot: '15:30',
    status: 'confirmed',
    paymentMethod: 'on_site',
    paymentStatus: 'pending',
    amountXOF: 30000,
    depositPaidXOF: 0,
    source: 'receptionist_walkin',
    notes: 'Passé au comptoir hier pour réserver un créneau cardiologie.',
    reminderSent: true,
    createdAt: '2026-09-29 11:30',
  },
];

export const initialNotificationLogs: NotificationLog[] = [
  {
    id: 'notif-1',
    appointmentId: 'apt-1',
    recipientPhone: '+221 77 450 12 34',
    channel: 'whatsapp',
    type: 'reminder_24h',
    messageFr: 'Bonjour Moussa Diop, rappel de votre RDV le 30/09 à 09:00 avec Dr. Fatou Ndiaye à Clinique Keur Madior. En cas d’empêchement, prévenez au +221 33 820 12 34.',
    messageWolof: 'Dalal ak jamm Moussa Diop, fàttali la sa rdv ëllëg ci 09:00 ak Dr. Fatou Ndiaye ci Clinique Keur Madior. Bu amee lu la xawa téye, wooteel ci +221 33 820 12 34.',
    sentAt: '2026-09-29 18:00',
    status: 'delivered',
  },
  {
    id: 'notif-2',
    appointmentId: 'apt-2',
    recipientPhone: '+221 78 610 88 44',
    channel: 'sms',
    type: 'confirmation',
    messageFr: 'Clinique Keur Madior: Votre RDV Échographie du 30/09 à 09:45 est confirmé. Acompte Wave de 10 000 FCFA bien reçu. Réf: SN-RDV-2602.',
    messageWolof: 'Clinique Keur Madior: Sa rdv Échographie 30/09 ci 09:45 dëppoo na. Jëli nanu acompte Wave 10 000 FCFA. Réf: SN-RDV-2602.',
    sentAt: '2026-09-29 16:06',
    status: 'delivered',
  },
];

export const initialMessageTemplates: MessageTemplate[] = [
  {
    id: 'tpl-1',
    tenantId: 't-1',
    channel: 'sms',
    trigger: 'confirmation',
    title: 'Confirmation Immédiate (SMS)',
    description: "Envoyé instantanément au patient lors de la validation du rendez-vous.",
    bodyFr: "{nom_clinique}: RDV confirmé avec {nom_medecin} ({specialite}) le {date_rdv} à {heure_rdv}. Billet: {lien_billet}. Contact: {contact_clinique}",
    bodyWolof: "{nom_clinique}: Sa rdv ak {nom_medecin} le {date_rdv} ci {heure_rdv} dëppoo na. Sa pass: {lien_billet}. Wooteel ci {contact_clinique}",
    languageMode: 'fr',
    isActive: true,
    sendTimingOffsetMinutes: 0,
    includeTicketLink: true,
    includeCancelLink: false,
    includeGpsLink: false,
    includeWaveDepositLink: true,
    updatedAt: '2026-10-24 10:15',
  },
  {
    id: 'tpl-2',
    tenantId: 't-1',
    channel: 'sms',
    trigger: 'reminder_24h',
    title: 'Rappel J-1 / 24 heures avant (SMS)',
    description: "Rappel automatique 24h avant pour valider la présence et éviter les no-shows.",
    bodyFr: "Rappel: {patient_prenom}, votre RDV à {nom_clinique} avec {nom_medecin} est DEMAIN à {heure_rdv}. Merci d'arriver 10 min en avance. Annuler: {lien_annulation}",
    bodyWolof: "Fàttali: {patient_prenom}, sa rdv ak {nom_medecin} ci {nom_clinique} mingi ci ËLLËG ci {heure_rdv}. Ñëwal 10 mn ci kanam. Bu ko mënut: {lien_annulation}",
    languageMode: 'bilingual',
    isActive: true,
    sendTimingOffsetMinutes: -1440,
    includeTicketLink: false,
    includeCancelLink: true,
    includeGpsLink: false,
    includeWaveDepositLink: false,
    updatedAt: '2026-10-24 09:30',
  },
  {
    id: 'tpl-3',
    tenantId: 't-1',
    channel: 'sms',
    trigger: 'reminder_2h',
    title: 'Rappel Express H-2 (SMS)',
    description: "Dernière alerte 2h avant avec rappel du lieu et contact d'accueil.",
    bodyFr: "Flash RDV: {nom_clinique} vous attend aujourd'hui à {heure_rdv} avec {nom_medecin}. Adresse: {adresse_clinique}. Tel: {contact_clinique}",
    bodyWolof: "Flash RDV: {nom_clinique} mingi lay xaar tey ci {heure_rdv} ak {nom_medecin}. Fi nu nekk: {adresse_clinique}. Tel: {contact_clinique}",
    languageMode: 'fr',
    isActive: true,
    sendTimingOffsetMinutes: -120,
    includeTicketLink: false,
    includeCancelLink: false,
    includeGpsLink: false,
    includeWaveDepositLink: false,
    updatedAt: '2026-10-23 16:40',
  },
  {
    id: 'tpl-4',
    tenantId: 't-1',
    channel: 'whatsapp',
    trigger: 'confirmation',
    title: 'Confirmation & Pass Digital (WhatsApp)',
    description: "Message riche complet avec QR code, itinéraire Dakar et détails du praticien.",
    bodyFr: `Bonjour *{patient_prenom} {patient_nom}*,

Votre rendez-vous chez *{nom_clinique}* est bien confirmé ! ✅

🩺 *Médecin :* {nom_medecin} ({specialite})
📅 *Date :* {date_rdv}
⏰ *Heure :* {heure_rdv}
📍 *Adresse :* {adresse_clinique}
💳 *Acompte réglé :* {montant_acompte}

Consultez votre pass d'accès numérique et QR code d'enregistrement :
👉 {lien_billet}

Pour tout empêchement ou report :
📞 {contact_clinique} | Annulation autonome : {lien_annulation}

_Merci de votre confiance et bonne santé !_`,
    bodyWolof: `Salam *{patient_prenom} {patient_nom}*,

Sa rendez-vous ci *{nom_clinique}* dëppoo na tey ! ✅

🩺 *Praticien :* {nom_medecin} ({specialite})
📅 *Bes :* {date_rdv}
⏰ *Waxtu :* {heure_rdv}
📍 *Fi nu nekk :* {adresse_clinique}

Jëlal sa pass numérique ak QR code :
👉 {lien_billet}

Bu amee lu ko tée :
📞 {contact_clinique} | {lien_annulation}`,
    languageMode: 'fr',
    isActive: true,
    sendTimingOffsetMinutes: 0,
    includeTicketLink: true,
    includeCancelLink: true,
    includeGpsLink: true,
    includeWaveDepositLink: true,
    updatedAt: '2026-10-24 11:00',
  },
  {
    id: 'tpl-5',
    tenantId: 't-1',
    channel: 'whatsapp',
    trigger: 'reminder_24h',
    title: 'Rappel J-1 & Consignes (WhatsApp)',
    description: "Rappel détaillé la veille avec liste des documents à apporter.",
    bodyFr: `Bonjour *{patient_prenom}*,

Ceci est un rappel pour votre consultation de demain avec *{nom_medecin}* à *{heure_rdv}*.

📋 *À ne pas oublier :*
• Votre carnet de santé ou dossier médical
• Vos ordonnances en cours ou analyses récentes
• Votre pass digital : {lien_billet}

En cas d'empêchement, merci de prévenir l'accueil au *{contact_clinique}* ou via {lien_annulation}. À très bientôt !`,
    bodyWolof: `Salam *{patient_prenom}*,

Fàttali la sa rdv ëllëg ak *{nom_medecin}* ci *{heure_rdv}*.

📋 *Bul fàtte yóbbaale :*
• Sa karnet wér-gi-yaram walla analiis yi
• Sa pass digital : {lien_billet}

Bu amee lu xawa tée, wooteel ci *{contact_clinique}*. Jërëjëf !`,
    languageMode: 'bilingual',
    isActive: true,
    sendTimingOffsetMinutes: -1440,
    includeTicketLink: true,
    includeCancelLink: true,
    includeGpsLink: false,
    includeWaveDepositLink: false,
    updatedAt: '2026-10-24 08:20',
  },
  {
    id: 'tpl-6',
    tenantId: 't-1',
    channel: 'whatsapp',
    trigger: 'cancellation',
    title: "Avis d'Annulation (WhatsApp)",
    description: "Notification immédiate lorsque le rendez-vous est libéré.",
    bodyFr: `Bonjour *{patient_prenom}*, votre rendez-vous du *{date_rdv}* à *{heure_rdv}* chez *{nom_clinique}* a bien été annulé.

Pour réserver un nouveau créneau disponible :
👉 https://sunu.sn/e/{tenant_slug}

Contact direct : {contact_clinique}`,
    languageMode: 'fr',
    isActive: true,
    sendTimingOffsetMinutes: 0,
    includeTicketLink: false,
    includeCancelLink: false,
    includeGpsLink: false,
    includeWaveDepositLink: false,
    updatedAt: '2026-10-22 14:10',
  },
  {
    id: 'tpl-7',
    tenantId: 't-1',
    channel: 'whatsapp',
    trigger: 'followup',
    title: 'Suivi Post-Consultation (WhatsApp)',
    description: "Message de courtoisie et recueil d'avis envoyé 24h après le rendez-vous.",
    bodyFr: `Bonjour *{patient_prenom}*,

Toute l'équipe de *{nom_clinique}* espère que votre consultation avec *{nom_medecin}* s'est bien passée.

Votre santé et votre confort nous tiennent à cœur.
N'hésitez pas à nous contacter au *{contact_clinique}* pour tout renseignement sur vos ordonnances.

_Prenez bien soin de vous !_ 🌿`,
    languageMode: 'fr',
    isActive: false,
    sendTimingOffsetMinutes: 1440,
    includeTicketLink: false,
    includeCancelLink: false,
    includeGpsLink: false,
    includeWaveDepositLink: false,
    updatedAt: '2026-10-20 18:00',
  },
];

