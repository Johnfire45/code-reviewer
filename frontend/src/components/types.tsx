// Common types used across the application

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface NavigationItem {
  id: string;
  label: string;
}

export interface StatisticItem {
  number: string;
  label: string;
  icon: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface AboutItem {
  title: string;
  name: string;
  role: string;
  description: string;
  link: string;
}

export type SectionId = 'home' | 'analyzer' | 'features' | 'about'; 