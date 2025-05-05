export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          total_score: number
          health_level: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_score: number
          health_level: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_score?: number
          health_level?: string
          created_at?: string
        }
      }
      assessment_details: {
        Row: {
          id: string
          assessment_id: string
          remedy_id: string
          remedy_name: string
          score: number
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          remedy_id: string
          remedy_name: string
          score: number
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          remedy_id?: string
          remedy_name?: string
          score?: number
          created_at?: string
        }
      }
    }
  }
}
