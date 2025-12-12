
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  agent?: string; // The detected active agent for model messages
  isError?: boolean;
}

export interface AgentConfig {
  id: string;
  name: string; // The System ID (e.g., CONDOR-TECH)
  personaName: string; // The Human Name (e.g., Alex)
  color: string;
  borderColor: string;
  icon: string;
  description: string;
  gender: 'male' | 'female';
  avatarSeed: string;
}

export interface PaymentMethod {
  id: string;
  type: 'paypal' | 'stripe' | 'bitcoin';
  label: string;
  details: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  credits: number; // -1 for unlimited
  description: string;
  color: string;
  popular?: boolean;
}

export type AgentType = 
  | 'CONDOR-TECH'
  | 'CONDOR-PROJECT'
  | 'CONDOR-ROBO'
  | 'CONDOR-DIGITAL DEV'
  | 'CONDOR-MEDICA'
  | 'CONDOR-EDU'
  | 'CONDOR-MARKETER'
  | 'CONDOR-FIT'
  | 'CONDOR-CYBER'
  | 'CONDOR-MANAGER'
  | 'CONDOR-WEB-AI'
  | 'CONDOR-APP-DEV'
  | 'CONDOR-DATA'
  | 'CONDOR-CRYPTO'
  | 'CONDOR-LEGAL'
  | 'CONDOR-PSYCHE'
  | 'CONDOR-TRAVEL'
  | 'CONDOR-ART'
  | 'CONDOR-AUDIO'
  | 'CONDOR-GAME'
  | 'CONDOR-FINANCE'
  | 'CONDOR-SCIENCE'
  | 'CONDOR-ECO'
  | 'CONDOR-LINGUA'
  | 'CONDOR-MAKER'
  | 'CONDOR-TAX'
  | 'CONDOR-CALCIO'
  | 'CONDOR-SEO'
  | 'CONDOR-METEO'
  | 'CONDOR-NET'
  | 'CONDOR-X'
  // --- NEW AGENTS ---
  | 'CONDOR-STREAM'  // IPTV, M3U
  | 'CONDOR-CAM'     // IP Cams
  | 'CONDOR-MOVIE'   // Cinema, Download
  | 'CONDOR-BANK'    // Banking, CC, IBAN
  | 'CONDOR-MEDIA'   // Video/Photo editing
  | 'CONDOR-SHOP'    // Spesa, Prezzi
  | 'CONDOR-REAL-ESTATE' // Case
  | 'CONDOR-AUTO'    // Motori
  | 'CONDOR-JOB'     // Lavoro
  | 'CONDOR-PETS'    // Animali
  | 'CONDOR-GARDEN'  // Piante
  | 'CONDOR-COOK'    // Cucina
  | 'CONDOR-ASTRO'   // Spazio
  | 'CONDOR-FASHION' // Moda
  | 'CONDOR-BEAUTY'  // Estetica
  | 'CONDOR-WINE'    // Enologia
  | 'CONDOR-PARENT'  // Famiglia
  | 'CONDOR-SURVIVAL'// Sopravvivenza
  | 'CONDOR-HISTORY' // Storia
  | 'UNKNOWN';
