 
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string | null
          emails_bounced: number | null
          emails_clicked: number | null
          emails_delivered: number | null
          emails_opened: number | null
          emails_replied: number | null
          emails_sent: number | null
          id: string
          name: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
          total_recipients: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emails_bounced?: number | null
          emails_clicked?: number | null
          emails_delivered?: number | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          id?: string
          name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emails_bounced?: number | null
          emails_clicked?: number | null
          emails_delivered?: number | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          id?: string
          name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emails: {
        Row: {
          body_html: string | null
          body_text: string | null
          bounced_at: string | null
          campaign_id: string | null
          click_count: number | null
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          from_email: string
          id: string
          lead_id: string | null
          metadata: Json | null
          open_count: number | null
          opened_at: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          to_email: string
          tracking_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          click_count?: number | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          from_email: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          open_count?: number | null
          opened_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          to_email: string
          tracking_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          click_count?: number | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          from_email?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          open_count?: number | null
          opened_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
          tracking_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      export_history: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_size: number | null
          file_url: string | null
          filters: Json | null
          format: string
          id: string
          record_count: number
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_size?: number | null
          file_url?: string | null
          filters?: Json | null
          format: string
          id?: string
          record_count: number
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_size?: number | null
          file_url?: string | null
          filters?: Json | null
          format?: string
          id?: string
          record_count?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          address: string | null
          business_age: number | null
          business_description: string | null
          business_name: string
          city: string
          confidence_level: string | null
          contact_name: string | null
          country: string | null
          created_at: string | null
          data_source: string | null
          email: string | null
          google_place_id: string | null
          id: string
          industry: string
          last_contact_date: string | null
          latitude: number | null
          lead_score: number | null
          longitude: number | null
          phone: string | null
          postal_code: string | null
          province: string | null
          rating: number | null
          review_count: number | null
          status: string
          tags: string[] | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_age?: number | null
          business_description?: string | null
          business_name: string
          city: string
          confidence_level?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          data_source?: string | null
          email?: string | null
          google_place_id?: string | null
          id?: string
          industry: string
          last_contact_date?: string | null
          latitude?: number | null
          lead_score?: number | null
          longitude?: number | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          rating?: number | null
          review_count?: number | null
          status?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_age?: number | null
          business_description?: string | null
          business_name?: string
          city?: string
          confidence_level?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          data_source?: string | null
          email?: string | null
          google_place_id?: string | null
          id?: string
          industry?: string
          last_contact_date?: string | null
          latitude?: number | null
          lead_score?: number | null
          longitude?: number | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          rating?: number | null
          review_count?: number | null
          status?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          accepted_at: string | null
          content_html: string
          content_text: string
          created_at: string | null
          estimated_read_time: number | null
          id: string
          industry: string | null
          lead_id: string
          metadata: Json | null
          personalization_score: number | null
          rejected_at: string | null
          sent_at: string | null
          status: string
          template_name: string | null
          title: string
          tone: string | null
          updated_at: string | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          content_html: string
          content_text: string
          created_at?: string | null
          estimated_read_time?: number | null
          id?: string
          industry?: string | null
          lead_id: string
          metadata?: Json | null
          personalization_score?: number | null
          rejected_at?: string | null
          sent_at?: string | null
          status?: string
          template_name?: string | null
          title: string
          tone?: string | null
          updated_at?: string | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          content_html?: string
          content_text?: string
          created_at?: string | null
          estimated_read_time?: number | null
          id?: string
          industry?: string | null
          lead_id?: string
          metadata?: Json | null
          personalization_score?: number | null
          rejected_at?: string | null
          sent_at?: string | null
          status?: string
          template_name?: string | null
          title?: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          api_enabled: boolean | null
          api_key: string | null
          api_rate_limit: number | null
          created_at: string | null
          digest_frequency: string | null
          email_notifications: boolean | null
          export_format: string | null
          language: string | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          theme: string | null
          timezone: string | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_enabled?: boolean | null
          api_key?: string | null
          api_rate_limit?: number | null
          created_at?: string | null
          digest_frequency?: string | null
          email_notifications?: boolean | null
          export_format?: string | null
          language?: string | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_enabled?: boolean | null
          api_key?: string | null
          api_rate_limit?: number | null
          created_at?: string | null
          digest_frequency?: string | null
          email_notifications?: boolean | null
          export_format?: string | null
          language?: string | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
