export type PlayerLevel = 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export const PLAYER_LEVELS: PlayerLevel[] = [2, 2.5, 3, 3.5, 4, 4.5, 5];

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  level: PlayerLevel;
  is_admin: boolean;
  created_at: string;
}

export type TournamentStatus = 'upcoming' | 'active' | 'completed';

export interface Tournament {
  id: string;
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  location: string;
  level_min: PlayerLevel;
  level_max: PlayerLevel;
  price: number;
  max_players: number;
  paybox_url: string | null;
  whatsapp_url: string | null;
  status: TournamentStatus;
  description: string | null;
  created_at: string;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  player_id: string;
  status: RegistrationStatus;
  created_at: string;
}

export interface RegistrationWithProfile extends TournamentRegistration {
  profile: Profile;
}

export interface TournamentWithCount extends Tournament {
  registration_count: number;
  user_registration?: TournamentRegistration | null;
}
