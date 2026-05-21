export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type VehicleIdDB = 'hyundai_kona' | 'tesla_model_3' | 'ford_capri';
export type TripTypeDB = 'one_way' | 'round_trip';
export type LocaleDB = 'en' | 'ro';

export interface BookingRow {
  id: string;
  created_at: string;
  updated_at: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_datetime: string;
  dropoff_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  vehicle_id: VehicleIdDB;
  passengers: number;
  trip_type: TripTypeDB;
  return_datetime: string | null;
  distance_km: number;
  duration_minutes: number;
  price_per_km: number;
  base_price_eur: number;
  round_trip_multiplier: number;
  long_distance_multiplier: number;
  peak_surcharge_eur: number;
  total_price_eur: number;
  is_peak_hour: boolean;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  flight_number: string | null;
  notes: string | null;
  status: BookingStatus;
  locale: LocaleDB;
  admin_notes: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
}

export type BookingInsert = Omit<BookingRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type BookingUpdate = Partial<BookingInsert>;

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: BookingRow;
        Insert: BookingInsert;
        Update: BookingUpdate;
      };
    };
  };
}
