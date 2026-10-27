export interface MassageService {
  id: string;
  title: string;
  subtitle: string;
  category: 'therapeutic' | 'relax' | 'special' | 'express';
  description: string;
  benefits: string[];
  durations: {
    minutes: number;
    price: number;
    popular?: boolean;
  }[];
  indication: string;
  recommendedCourse: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  age: number;
  location: string; // e.g. "Бежецк, ул. Ленина"
  tag: string;
  text: string;
  service: string;
  date: string;
  rating: number;
  verified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'hygiene' | 'space' | 'health' | 'organization';
}

export interface BookingData {
  serviceId: string;
  durationMinutes: number;
  price: number;
  clientName: string;
  phone: string;
  address: string;
  date: string;
  preferredTime: string;
  comment: string;
  messenger: 'whatsapp' | 'telegram' | 'phone';
}
