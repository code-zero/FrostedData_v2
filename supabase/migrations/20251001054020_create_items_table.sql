/*
  # Create Items Table for CRUD Application

  1. New Tables
    - `items`
      - `id` (uuid, primary key) - Unique identifier for each item
      - `title` (text, required) - Item title/name
      - `description` (text, optional) - Item description
      - `created_at` (timestamptz) - Timestamp when item was created
      - `updated_at` (timestamptz) - Timestamp when item was last updated
      - `user_id` (uuid) - Reference to the user who created the item

  2. Security
    - Enable RLS on `items` table
    - Add policy for authenticated users to view all items
    - Add policy for authenticated users to create their own items
    - Add policy for authenticated users to update their own items
    - Add policy for authenticated users to delete their own items

  3. Important Notes
    - All timestamps default to current time
    - RLS ensures users can only modify their own data
    - Public read access for all authenticated users
*/

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all items"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);