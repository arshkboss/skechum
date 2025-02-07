import { Metadata } from 'next'
import { createClient } from "@/utils/supabase/server"
import { notFound } from 'next/navigation'
import Image from 'next/image'

type Props = {
  params: { uid: string }
}

// Metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase
      .from('auth.users')
      .select('*')
      .eq('id', params.uid)
      .single()

    if (!user) {
      return {
        title: 'User Not Found',
        description: 'This user profile does not exist on Skechum',
      }
    }

    return {
      title: `${user.raw_user_meta_data?.display_name || user.email} | Skechum`,
      description: `View ${user.raw_user_meta_data?.display_name || user.email}'s artwork on Skechum`,
      openGraph: {
        title: `${user.raw_user_meta_data?.display_name || user.email} on Skechum`,
        description: `View ${user.raw_user_meta_data?.display_name || user.email}'s artwork`,
        images: [
          {
            url: user.raw_user_meta_data?.avatar_url || '/default-profile-og.png',
            width: 1200,
            height: 630,
            alt: `${user.raw_user_meta_data?.display_name || user.email}'s profile`,
          },
        ],
      },
    }
  } catch (error) {
    console.error('Error fetching user metadata:', error)
    return {
      title: 'User Profile',
      description: 'View user profile on Skechum',
    }
  }
}

// Page component
export default async function UserProfilePage({ params }: Props) {
  try {
    const supabase = await createClient()
    
    // Fetch user data
    const { data: user } = await supabase
      .from('auth.users')
      .select('*')
      .eq('id', params.uid)
      .single()

    if (!user) {
      notFound()
    }

    // Fetch user's credits
    const { data: credits } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single()

    // Fetch user's generated images
    const { data: userImages } = await supabase
      .from('user_images')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return (
      <div className="container max-w-4xl py-6 md:py-12">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <Image 
                src={user.raw_user_meta_data?.avatar_url || '/default-avatar.png'}
                alt={user.raw_user_meta_data?.display_name || user.email}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user.raw_user_meta_data?.display_name || user.email}
              </h1>
              <p className="text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
              {credits && (
                <p className="text-sm text-muted-foreground mt-1">
                  {credits.credits} credits available
                </p>
              )}
            </div>
          </div>

          {/* User's Generated Images */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Generated Artwork</h2>
            {userImages && userImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userImages.map((image) => (
                  <div 
                    key={image.id} 
                    className="aspect-square relative overflow-hidden rounded-lg group"
                  >
                    <Image
                      src={image.url}
                      alt={image.prompt || 'Generated artwork'}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {image.prompt && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                        <p className="text-white text-sm line-clamp-3">
                          {image.prompt}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No artwork generated yet.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading user profile:', error)
    return (
      <div className="container max-w-4xl py-6 md:py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">
            There was an error loading this profile. Please try again later.
          </p>
        </div>
      </div>
    )
  }
} 