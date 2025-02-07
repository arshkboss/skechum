-- Create images table to store metadata
CREATE TABLE public.images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    owner UUID REFERENCES auth.users(id),
    description TEXT,
    
    CONSTRAINT valid_category CHECK (
        category IN ('people', 'nature', 'technology', 'abstract', 'other')
    )
);

-- Set up RLS policies
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public images are viewable by everyone"
    ON public.images FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own images"
    ON public.images FOR INSERT
    TO authenticated
    WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update their own images"
    ON public.images FOR UPDATE
    TO authenticated
    USING (owner = auth.uid());

CREATE POLICY "Users can delete their own images"
    ON public.images FOR DELETE
    TO authenticated
    USING (owner = auth.uid()); 