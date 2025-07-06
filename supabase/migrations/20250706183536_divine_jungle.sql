/*
  # Enhanced achievements functionality and database constraints

  1. Constraints
    - Add constraint to ensure total_carbon_saved is non-negative
    - Add constraint to limit user level between 1 and 10

  2. Functions
    - Function to update total carbon saved when activities are added
    - Function to automatically update user level based on carbon saved
    - Function to check and award achievements

  3. Triggers
    - Trigger to update carbon saved when activities are inserted
    - Trigger to update user level when carbon saved changes
    - Trigger to check for new achievements

  4. Data
    - Insert default achievements if they don't exist
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

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert achievements for users who qualify but haven't received them yet
  INSERT INTO user_achievements (user_id, achievement_id)
  SELECT 
    NEW.id as user_id,
    a.id as achievement_id
  FROM achievements a
  WHERE a.carbon_required <= NEW.total_carbon_saved
  AND NOT EXISTS (
    SELECT 1 
    FROM user_achievements ua 
    WHERE ua.user_id = NEW.id 
    AND ua.achievement_id = a.id
  );
  
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

DROP TRIGGER IF EXISTS check_achievements_trigger ON profiles;
CREATE TRIGGER check_achievements_trigger
  AFTER UPDATE OF total_carbon_saved ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_and_award_achievements();

-- Insert achievements only if they don't already exist (using WHERE NOT EXISTS)
INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'First Steps', 'Begin your eco-friendly journey', '🌱', 0
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'First Steps');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Carbon Saver', 'Save 10 kg of carbon emissions', '🌿', 10
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Carbon Saver');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Eco Enthusiast', 'Save 50 kg of carbon emissions', '🌲', 50
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Eco Enthusiast');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Climate Champion', 'Save 100 kg of carbon emissions', '🌳', 100
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Climate Champion');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Earth Guardian', 'Save 200 kg of carbon emissions', '🌍', 200
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Earth Guardian');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Climate Warrior', 'Save 500 kg of carbon emissions', '⚡', 500
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Climate Warrior');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Planetary Savior', 'Save 1000 kg of carbon emissions', '🌠', 1000
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Planetary Savior');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Transport Hero', 'Save 100 kg through eco-friendly transport', '🚲', 100
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Transport Hero');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Waste Warrior', 'Save 50 kg through proper waste management', '♻️', 50
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Waste Warrior');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Diet Champion', 'Save 75 kg through sustainable diet choices', '🥗', 75
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Diet Champion');

INSERT INTO achievements (name, description, icon, carbon_required)
SELECT 'Energy Master', 'Save 150 kg through energy conservation', '💡', 150
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Energy Master');