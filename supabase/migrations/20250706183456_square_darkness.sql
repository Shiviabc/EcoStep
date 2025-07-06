/*
  # Add constraints and improve database functions

  1. Changes
    - Add proper constraints to ensure data integrity
    - Improve trigger functions for better achievement tracking
    - Add function to update total carbon saved properly
*/

-- Add constraints to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'total_carbon_saved_non_negative' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT total_carbon_saved_non_negative 
    CHECK (total_carbon_saved >= 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'level_range' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT level_range 
    CHECK (level >= 1 AND level <= 10);
  END IF;
END $$;

-- Create function to update total carbon saved
CREATE OR REPLACE FUNCTION update_total_carbon_saved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only update if the carbon impact is negative (carbon saved)
  IF NEW.carbon_impact < 0 THEN
    UPDATE profiles 
    SET total_carbon_saved = total_carbon_saved + ABS(NEW.carbon_impact)
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create function to update user level based on carbon saved
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Calculate new level based on total carbon saved (every 100kg = 1 level)
  NEW.level = GREATEST(1, LEAST(10, FLOOR(NEW.total_carbon_saved / 100) + 1));
  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS update_carbon_saved_trigger ON activities;
CREATE TRIGGER update_carbon_saved_trigger
  AFTER INSERT ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_total_carbon_saved();

DROP TRIGGER IF EXISTS update_level_trigger ON profiles;
CREATE TRIGGER update_level_trigger
  BEFORE UPDATE OF total_carbon_saved ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Ensure all existing achievements are properly set up
INSERT INTO achievements (name, description, icon, carbon_required) VALUES
  ('First Steps', 'Begin your eco-friendly journey', '🌱', 0),
  ('Carbon Saver', 'Save 10 kg of carbon emissions', '🌿', 10),
  ('Eco Enthusiast', 'Save 50 kg of carbon emissions', '🌲', 50),
  ('Climate Champion', 'Save 100 kg of carbon emissions', '🌳', 100),
  ('Earth Guardian', 'Save 200 kg of carbon emissions', '🌍', 200),
  ('Climate Warrior', 'Save 500 kg of carbon emissions', '⚡', 500),
  ('Planetary Savior', 'Save 1000 kg of carbon emissions', '🌠', 1000),
  ('Transport Hero', 'Save 100 kg through eco-friendly transport', '🚲', 100),
  ('Waste Warrior', 'Save 50 kg through proper waste management', '♻️', 50),
  ('Diet Champion', 'Save 75 kg through sustainable diet choices', '🥗', 75),
  ('Energy Master', 'Save 150 kg through energy conservation', '💡', 150)
ON CONFLICT (name) DO NOTHING;