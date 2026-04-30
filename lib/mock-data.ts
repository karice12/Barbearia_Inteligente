// BarberPro — Dados centralizados mockados

export type AppointmentStatus = 'confirmed' | 'late' | 'waiting' | 'done' | 'cancelled'
export type UserRole = 'owner' | 'barber' | 'receptionist'

export interface Service {
  id: string
  name: string
  duration: number // minutos
  price: number
  description: string
  image: string
}

export interface Professional {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  specialties: string[]
}

export interface Appointment {
  id: string
  time: string
  clientName: string
  service: string
  professionalId: string
  professionalName: string
  status: AppointmentStatus
  price: number
  phone: string
}

export interface Client {
  id: string
  name: string
  phone: string
  lastVisit: string
  daysInactive: number
  totalSpent: number
  loyaltyStamps: number
  visits: number
}

export interface Transaction {
  id: string
  description: string
  client: string
  professional: string
  amount: number
  type: 'income' | 'expense'
  time: string
  method: 'pix' | 'card' | 'cash'
  commission: number
}

// KPIs
export const kpis = {
  revenueToday: 850,
  revenueGoal: 1500,
  appointments: 22,
  occupancy: 85,
  newClients: 6,
  avgTicket: 63.5,
}

// Serviços do catálogo
export const services: Service[] = [
  {
    id: 'svc-1',
    name: 'Corte Degradê',
    duration: 30,
    price: 50,
    description: 'Degradê moderno com acabamento perfeito',
    image: '/images/service-degrade.jpg',
  },
  {
    id: 'svc-2',
    name: 'Barba na Toalha Quente',
    duration: 20,
    price: 35,
    description: 'Relaxamento e acabamento profissional',
    image: '/images/service-barba.jpg',
  },
  {
    id: 'svc-3',
    name: 'Combo Corte + Barba',
    duration: 50,
    price: 75,
    description: 'Pacote completo com desconto especial',
    image: '/images/service-combo.jpg',
  },
  {
    id: 'svc-4',
    name: 'Barboterapia',
    duration: 40,
    price: 60,
    description: 'Tratamento premium com óleos essenciais',
    image: '/images/service-barboterapia.jpg',
  },
  {
    id: 'svc-5',
    name: 'Hidratação Capilar',
    duration: 35,
    price: 45,
    description: 'Nutrição profunda para cabelos ressecados',
    image: '/images/service-hidratacao.jpg',
  },
  {
    id: 'svc-6',
    name: 'Pigmentação',
    duration: 60,
    price: 90,
    description: 'Cobertura de fios brancos e coloração natural',
    image: '/images/service-pigmentacao.jpg',
  },
]

// Profissionais
export const professionals: Professional[] = [
  {
    id: 'pro-1',
    name: 'Thiago Oliveira',
    role: 'Barbeiro Sênior',
    avatar: '/images/pro-thiago.jpg',
    rating: 4.9,
    specialties: ['Degradê', 'Navalhado'],
  },
  {
    id: 'pro-2',
    name: 'Rafael Costa',
    role: 'Barbeiro',
    avatar: '/images/pro-rafael.jpg',
    rating: 4.7,
    specialties: ['Barba', 'Combo'],
  },
  {
    id: 'pro-3',
    name: 'Bruno Alves',
    role: 'Barbeiro',
    avatar: '/images/pro-bruno.jpg',
    rating: 4.8,
    specialties: ['Coloração', 'Tratamentos'],
  },
]

// Agenda do dia
export const todayAppointments: Appointment[] = [
  {
    id: 'apt-1',
    time: '09:00',
    clientName: 'Marcos Pereira',
    service: 'Corte Degradê',
    professionalId: 'pro-1',
    professionalName: 'Thiago',
    status: 'done',
    price: 50,
    phone: '11999001234',
  },
  {
    id: 'apt-2',
    time: '09:30',
    clientName: 'Felipe Nunes',
    service: 'Barba na Toalha Quente',
    professionalId: 'pro-2',
    professionalName: 'Rafael',
    status: 'done',
    price: 35,
    phone: '11988002345',
  },
  {
    id: 'apt-3',
    time: '10:00',
    clientName: 'André Lima',
    service: 'Combo Corte + Barba',
    professionalId: 'pro-1',
    professionalName: 'Thiago',
    status: 'done',
    price: 75,
    phone: '11977003456',
  },
  {
    id: 'apt-4',
    time: '13:30',
    clientName: 'João Souza',
    service: 'Pigmentação',
    professionalId: 'pro-3',
    professionalName: 'Bruno',
    status: 'done',
    price: 90,
    phone: '11966004567',
  },
  {
    id: 'apt-5',
    time: '14:00',
    clientName: 'Carlos Silva',
    service: 'Corte Degradê',
    professionalId: 'pro-1',
    professionalName: 'Thiago',
    status: 'late',
    price: 50,
    phone: '11955005678',
  },
  {
    id: 'apt-6',
    time: '14:30',
    clientName: 'Lucas Mendes',
    service: 'Barboterapia',
    professionalId: 'pro-2',
    professionalName: 'Rafael',
    status: 'confirmed',
    price: 60,
    phone: '11944006789',
  },
  {
    id: 'apt-7',
    time: '15:00',
    clientName: 'Gabriel Rocha',
    service: 'Hidratação Capilar',
    professionalId: 'pro-3',
    professionalName: 'Bruno',
    status: 'confirmed',
    price: 45,
    phone: '11933007890',
  },
  {
    id: 'apt-8',
    time: '15:30',
    clientName: 'Diego Torres',
    service: 'Barba na Toalha Quente',
    professionalId: 'pro-1',
    professionalName: 'Thiago',
    status: 'waiting',
    price: 35,
    phone: '11922008901',
  },
  {
    id: 'apt-9',
    time: '16:00',
    clientName: 'Renato Gomes',
    service: 'Combo Corte + Barba',
    professionalId: 'pro-2',
    professionalName: 'Rafael',
    status: 'waiting',
    price: 75,
    phone: '11911009012',
  },
  {
    id: 'apt-10',
    time: '17:00',
    clientName: 'Igor Santana',
    service: 'Corte Degradê',
    professionalId: 'pro-3',
    professionalName: 'Bruno',
    status: 'waiting',
    price: 50,
    phone: '11900010123',
  },
]

// Clientes com risco de inatividade
export const inactiveClients: Client[] = [
  { id: 'cli-1', name: 'Pedro Andrade', phone: '11999111111', lastVisit: '18 mar', daysInactive: 36, totalSpent: 420, loyaltyStamps: 7, visits: 12 },
  { id: 'cli-2', name: 'Luiz Carvalho', phone: '11999222222', lastVisit: '15 mar', daysInactive: 39, totalSpent: 380, loyaltyStamps: 6, visits: 10 },
  { id: 'cli-3', name: 'Rodrigo Faria', phone: '11999333333', lastVisit: '12 mar', daysInactive: 42, totalSpent: 650, loyaltyStamps: 9, visits: 18 },
  { id: 'cli-4', name: 'Paulo Medeiros', phone: '11999444444', lastVisit: '10 mar', daysInactive: 44, totalSpent: 290, loyaltyStamps: 4, visits: 8 },
  { id: 'cli-5', name: 'Vinícius Cunha', phone: '11999555555', lastVisit: '8 mar', daysInactive: 46, totalSpent: 510, loyaltyStamps: 8, visits: 14 },
  { id: 'cli-6', name: 'Henrique Sales', phone: '11999666666', lastVisit: '5 mar', daysInactive: 49, totalSpent: 180, loyaltyStamps: 3, visits: 5 },
  { id: 'cli-7', name: 'Matheus Nogueira', phone: '11999777777', lastVisit: '2 mar', daysInactive: 52, totalSpent: 730, loyaltyStamps: 10, visits: 22 },
  { id: 'cli-8', name: 'Alex Barbosa', phone: '11999888888', lastVisit: '28 fev', daysInactive: 55, totalSpent: 450, loyaltyStamps: 7, visits: 13 },
]

// Todos os clientes
export const allClients: Client[] = [
  ...inactiveClients,
  { id: 'cli-9', name: 'Carlos Silva', phone: '11955005678', lastVisit: 'Hoje', daysInactive: 0, totalSpent: 800, loyaltyStamps: 5, visits: 20 },
  { id: 'cli-10', name: 'Lucas Mendes', phone: '11944006789', lastVisit: 'Hoje', daysInactive: 0, totalSpent: 960, loyaltyStamps: 8, visits: 26 },
  { id: 'cli-11', name: 'Gabriel Rocha', phone: '11933007890', lastVisit: 'Ontem', daysInactive: 1, totalSpent: 350, loyaltyStamps: 4, visits: 9 },
  { id: 'cli-12', name: 'Marcos Pereira', phone: '11999001234', lastVisit: 'Hoje', daysInactive: 0, totalSpent: 1100, loyaltyStamps: 10, visits: 30 },
]

// Transações financeiras
export const transactions: Transaction[] = [
  { id: 'txn-1', description: 'Corte Degradê', client: 'Marcos Pereira', professional: 'Thiago', amount: 50, type: 'income', time: '09:00', method: 'pix', commission: 25 },
  { id: 'txn-2', description: 'Barba na Toalha Quente', client: 'Felipe Nunes', professional: 'Rafael', amount: 35, type: 'income', time: '09:30', method: 'card', commission: 17.5 },
  { id: 'txn-3', description: 'Combo Corte + Barba', client: 'André Lima', professional: 'Thiago', amount: 75, type: 'income', time: '10:00', method: 'cash', commission: 37.5 },
  { id: 'txn-4', description: 'Insumos / Produtos', client: '—', professional: '—', amount: 120, type: 'expense', time: '11:00', method: 'pix', commission: 0 },
  { id: 'txn-5', description: 'Pigmentação', client: 'João Souza', professional: 'Bruno', amount: 90, type: 'income', time: '13:30', method: 'card', commission: 45 },
  { id: 'txn-6', description: 'Corte Degradê', client: 'Carlos Silva', professional: 'Thiago', amount: 50, type: 'income', time: '14:00', method: 'pix', commission: 25 },
]

// Comissões por profissional
export const commissions = [
  { professionalId: 'pro-1', name: 'Thiago Oliveira', services: 8, revenue: 400, commission: 200, percentage: 50 },
  { professionalId: 'pro-2', name: 'Rafael Costa', services: 7, revenue: 315, commission: 157.5, percentage: 50 },
  { professionalId: 'pro-3', name: 'Bruno Alves', services: 6, revenue: 270, commission: 135, percentage: 50 },
]

// Lista de espera
export const waitingList = [
  { id: 'wl-1', clientName: 'Caio Pinto', service: 'Corte Degradê', requestedTime: '14:00', phone: '11988001122' },
  { id: 'wl-2', clientName: 'Enzo Marques', service: 'Combo Corte + Barba', requestedTime: '15:00', phone: '11988003344' },
  { id: 'wl-3', clientName: 'Davi Azevedo', service: 'Barba na Toalha Quente', requestedTime: '16:00', phone: '11988005566' },
]

// Horários disponíveis para booking
export const availableSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
]

// Planos de pricing
export const pricingPlans = [
  {
    id: 'start',
    name: 'Start',
    monthlyPrice: 97,
    annualPrice: 78,
    description: 'Ideal para barbearias que estão começando',
    color: 'blue',
    features: [
      'Agendamento online ilimitado',
      'Até 2 profissionais',
      'App de autoatendimento para clientes',
      'Notificações por WhatsApp',
      'Relatórios básicos',
      'Suporte via chat',
    ],
    notIncluded: [
      'Automação de retenção / CRM',
      'Comissões automáticas',
      'Múltiplas unidades',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 197,
    annualPrice: 158,
    description: 'Para barbearias que querem crescer de verdade',
    color: 'orange',
    popular: true,
    features: [
      'Tudo do plano Start',
      'Profissionais ilimitados',
      'CRM & Automação de retenção',
      'Campanhas de resgate via WhatsApp',
      'Comissões automáticas por barbeiro',
      'Gestão financeira completa',
      'Lista de espera inteligente',
      'Múltiplas unidades',
      'Suporte prioritário 24/7',
    ],
    notIncluded: [],
  },
]
