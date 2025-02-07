-- Add new columns to existing user_images table
ALTER TABLE user_images
ADD COLUMN category TEXT,
ADD COLUMN description TEXT,
ADD COLUMN tags TEXT[] DEFAULT '{}',
ADD COLUMN is_public BOOLEAN DEFAULT true,
ADD CONSTRAINT valid_category CHECK (
    category IN ('people', 'nature', 'technology', 'abstract', 'other')
);

-- Add indexes for better query performance
CREATE INDEX idx_user_images_category ON user_images(category);
CREATE INDEX idx_user_images_created_at ON user_images(created_at DESC);
CREATE INDEX idx_user_images_keywords ON user_images USING gin(to_tsvector('english', keywords));
CREATE INDEX idx_user_images_is_public ON user_images(is_public);

-- Update RLS policies
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- Public can view public images
CREATE POLICY "Public images are viewable by everyone"
    ON user_images FOR SELECT
    USING (is_public = true);

-- Users can view their own private images
CREATE POLICY "Users can view their own images"
    ON user_images FOR SELECT
    USING (user_id = auth.uid());

-- Users can insert their own images
CREATE POLICY "Users can insert their own images"
    ON user_images FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Users can update their own images
CREATE POLICY "Users can update their own images"
    ON user_images FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Users can delete their own images
CREATE POLICY "Users can delete their own images"
    ON user_images FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Function to update category based on keywords
CREATE OR REPLACE FUNCTION update_category_from_keywords()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.keywords ILIKE '%person%' OR NEW.keywords ILIKE '%woman%' OR NEW.keywords ILIKE '%man%' THEN
        NEW.category := 'people';
    ELSIF NEW.keywords ILIKE '%nature%' OR NEW.keywords ILIKE '%landscape%' THEN
        NEW.category := 'nature';
    ELSIF NEW.keywords ILIKE '%tech%' OR NEW.keywords ILIKE '%robot%' THEN
        NEW.category := 'technology';
    ELSIF NEW.keywords ILIKE '%abstract%' THEN
        NEW.category := 'abstract';
    ELSE
        NEW.category := 'other';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set category
CREATE TRIGGER set_category_trigger
    BEFORE INSERT OR UPDATE OF keywords
    ON user_images
    FOR EACH ROW
    EXECUTE FUNCTION update_category_from_keywords(); 