-- Create user_images table
CREATE TABLE IF NOT EXISTS public.user_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    style TEXT NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('PNG', 'SVG')),
    is_colored BOOLEAN NOT NULL DEFAULT false,
    keywords TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX user_images_user_id_idx ON public.user_images(user_id);
CREATE INDEX user_images_keywords_idx ON public.user_images USING gin(keywords);

-- Add RLS policies
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

-- Users can view all public images
CREATE POLICY "Anyone can view public images"
    ON public.user_images
    FOR SELECT
    USING (true);

-- Users can only insert their own images
CREATE POLICY "Users can insert own images"
    ON public.user_images
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update/delete their own images
CREATE POLICY "Users can update own images"
    ON public.user_images
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
    ON public.user_images
    FOR DELETE
    USING (auth.uid() = user_id); 