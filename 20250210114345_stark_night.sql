/*
  # Create profiles and bookings tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `hotel_id` (text)
      - `hotel_name` (text)
      - `check_in` (timestamp)
      - `check_out` (timestamp)
      - `guests` (jsonb)
      - `total_price` (numeric)
      - `status` (text)
      - `booking_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  hotel_id text NOT NULL,
  hotel_name text NOT NULL,
  check_in timestamptz NOT NULL,
  check_out timestamptz NOT NULL,
  guests jsonb NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  booking_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);