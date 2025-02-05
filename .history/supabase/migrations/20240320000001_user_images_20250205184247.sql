-- Create user_images table
CREATE TABLE public.user_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  image_url text NOT NULL,
  prompt text NOT NULL,
  style text NOT NULL,
  format text NOT NULL CHECK (format IN ('PNG', 'SVG')),
  is_colored boolean NOT NULL DEFAULT false,
  keywords text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_images_pkey PRIMARY KEY (id),
  CONSTRAINT user_images_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX user_images_user_id_idx ON public.user_images(user_id);
CREATE INDEX user_images_keywords_idx ON public.user_images USING gin(keywords);

-- Enable Row Level Security
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view public images"
    ON public.user_images
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own images"
    ON public.user_images
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images"
    ON public.user_images
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
    ON public.user_images
    FOR DELETE
    USING (auth.uid() = user_id); 