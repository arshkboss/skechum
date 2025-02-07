"use client"

import { Metadata } from 'next'
import { createClient } from "@/utils/supabase/server"

type Props = {
  params: { username: string }
}

// Separate metadata generation function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch user data
  const supabase = createClient()
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!user) {
    return {
      title: 'User Not Found',
      description: 'This user profile does not exist on Skechum',
    }
  }

  return {
    title: `${user.name}'s Profile | Skechum`,
    description: `View ${user.name}'s artwork and creations on Skechum`,
    openGraph: {
      title: `${user.name} on Skechum`,
      description: `View ${user.name}'s artwork and creations`,
      images: [
        {
          url: user.avatar_url || '/default-profile-og.png',
          width: 1200,
          height: 630,
          alt: `${user.name}'s profile`,
        },
      ],
    },
  }
}

// Actual page component
export default async function UserProfilePage({ params }: Props) {
  const supabase = createClient()
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!user) {
    return (
      <div className="container max-w-4xl py-6 md:py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground">
            The user profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 md:py-12">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <img 
            src={user.avatar_url || '/default-avatar.png'} 
            alt={user.name}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {/* User's Generated Images */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Generated Artwork</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Add user's generated images here */}
          </div>
        </div>
      </div>
    </div>
  )
} 