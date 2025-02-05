'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"

export default function TestPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [testResults, setTestResults] = useState<{[key: string]: boolean | string}>({})
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function init() {
      await checkAuth()
      await checkTables()
    }
    init()
  }, [])

  async function checkAuth() {
    console.log('🔍 Checking authentication...')
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ Auth Error:', error)
      return
    }
    
    if (user) {
      console.log('✅ User authenticated:', user.id)
      setUserId(user.id)
      await fetchCredits(user.id)
    } else {
      console.log('❌ No user authenticated')
    }
  }

  async function fetchCredits(uid: string) {
    console.log('🔍 Fetching credits for user:', uid)
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', uid)
      .single()
    
    if (error) {
      console.error('❌ Credits Error:', error)
      return
    }
    
    if (data) {
      console.log('✅ Credits found:', data.credits)
      setCredits(data.credits)
    } else {
      console.log('❌ No credits found')
    }
  }

  async function addCredits(amount: number = 10) {
    console.log('💰 Adding credits:', amount)
    if (!userId) {
      console.error('❌ No user authenticated')
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .update({ 
          credits: (credits || 0) + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('❌ Add Credits Error:', error)
        return
      }

      console.log('✅ Credits added successfully:', data)
      await fetchCredits(userId)
    } catch (e) {
      console.error('❌ Add Credits Error:', e)
    }
  }

  async function deductCredits(amount: number = 3) {
    console.log('💸 Deducting credits:', amount)
    if (!userId || credits === null) {
      console.error('❌ No user or credits not loaded')
      return
    }

    if (credits < amount) {
      console.error('❌ Insufficient credits')
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .update({ 
          credits: credits - amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('❌ Deduct Credits Error:', error)
        return
      }

      console.log('✅ Credits deducted successfully:', data)
      await fetchCredits(userId)
    } catch (e) {
      console.error('❌ Deduct Credits Error:', e)
    }
  }

  async function uploadTestFile() {
    console.log('📁 Testing file upload...')
    if (!userId) {
      console.error('❌ No user authenticated')
      return
    }

    try {
      // Create a test image
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'red'
        ctx.fillRect(0, 0, 100, 100)
      }

      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      )
      
      const file = new File([blob], `test-${Date.now()}.png`, { type: 'image/png' })
      
      console.log('📤 Uploading file...')
      const { data, error } = await supabase
        .storage
        .from('user-images')
        .upload(`${userId}/test-${Date.now()}.png`, file)

      if (error) {
        console.error('❌ Upload Error:', error)
        return
      }

      console.log('✅ File uploaded successfully:', data)
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('user-images')
        .getPublicUrl(data.path)
      
      console.log('🔗 Public URL:', publicUrl)
      
      // Insert record in user_images
      const { data: imageRecord, error: insertError } = await supabase
        .from('user_images')
        .insert({
          user_id: userId,
          image_url: publicUrl,
          prompt: 'Test upload',
          style: 'test',
          format: 'PNG',
          keywords: ['test']
        })
        .select()
        .single()

      if (insertError) {
        console.error('❌ Record Insert Error:', insertError)
        return
      }

      console.log('✅ Image record created:', imageRecord)
    } catch (e) {
      console.error('❌ Upload Test Error:', e)
    }
  }

  async function resetCredits() {
    console.log('🔄 Resetting credits to default...')
    if (!userId) {
      console.error('❌ No user authenticated')
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .update({ 
          credits: 10,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('❌ Reset Credits Error:', error)
        return
      }

      console.log('✅ Credits reset successfully:', data)
      await fetchCredits(userId)
    } catch (e) {
      console.error('❌ Reset Credits Error:', e)
    }
  }

  async function runAllTests() {
    console.log('🚀 Starting all tests...')
    setLoading(true)
    const results: {[key: string]: boolean | string} = {}

    try {
      // Test 1: Check Authentication
      console.log('\n🔍 Test 1: Checking Authentication...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('❌ Auth Error:', authError)
        results['Authentication'] = authError.message
      } else {
        console.log('✅ Authentication successful:', user?.id)
        results['Authentication'] = !!user
      }

      // Test 2: Check Credits Table
      if (user) {
        console.log('\n🔍 Test 2: Checking Credits Table...')
        const { data: credits, error: creditsError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (creditsError) {
          console.error('❌ Credits Error:', creditsError)
          results['Credits Error'] = creditsError.message
        } else {
          console.log('✅ Credits found:', credits)
          results['Credits Table'] = !!credits
        }
      }

      // Test 3: Test Image Upload
      console.log('\n🔍 Test 3: Testing Storage Upload...')
      try {
        const testBlob = new Blob(['test'], { type: 'image/png' })
        const testFile = new File([testBlob], 'test.png', { type: 'image/png' })
        
        console.log('📁 Attempting to upload test file...')
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('user-images')
          .upload(`test/${Date.now()}.png`, testFile)
        
        if (uploadError) {
          console.error('❌ Upload Error:', uploadError)
          results['Upload Error'] = uploadError.message
        } else {
          console.log('✅ File uploaded successfully:', uploadData)
          results['Storage Upload'] = !!uploadData
          
          // Cleanup
          if (uploadData) {
            console.log('🧹 Cleaning up test file...')
            const { error: deleteError } = await supabase
              .storage
              .from('user-images')
              .remove([uploadData.path])
            
            if (deleteError) {
              console.error('❌ Cleanup Error:', deleteError)
            } else {
              console.log('✅ Test file cleaned up')
            }
          }
        }
      } catch (e: any) {
        console.error('❌ Storage Test Error:', e)
        results['Upload Error'] = e.message
      }

      // Test 4: Test User Images Table
      if (user) {
        console.log('\n🔍 Test 4: Testing User Images Table...')
        const testData = {
          user_id: user.id,
          image_url: 'test_url',
          prompt: 'test prompt',
          style: 'test style',
          format: 'PNG',
          keywords: ['test']
        }
        
        console.log('📝 Attempting to insert test record:', testData)
        const { data: imageInsert, error: insertError } = await supabase
          .from('user_images')
          .insert(testData)
          .select()
          .single()
        
        if (insertError) {
          console.error('❌ Insert Error:', insertError)
          results['Insert Error'] = insertError.message
        } else {
          console.log('✅ Record inserted successfully:', imageInsert)
          results['Image Insert'] = !!imageInsert
          
          // Cleanup
          if (imageInsert) {
            console.log('🧹 Cleaning up test record...')
            const { error: deleteError } = await supabase
              .from('user_images')
              .delete()
              .eq('id', imageInsert.id)
            
            if (deleteError) {
              console.error('❌ Cleanup Error:', deleteError)
            } else {
              console.log('✅ Test record cleaned up')
            }
          }
        }
      }

    } catch (e: any) {
      console.error('❌ General Error:', e)
      results['General Error'] = e.message
    }

    console.log('\n📊 Final Test Results:', results)
    setTestResults(results)
    setLoading(false)
  }

  async function initializeUserCredits() {
    console.log('🎬 Initializing user credits...')
    if (!userId) {
      console.error('❌ No user authenticated')
      return
    }

    try {
      // First check if user already has credits
      const { data: existing, error: checkError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (existing) {
        console.log('✅ User already has credits:', existing)
        return existing
      }

      // If no credits exist, create new record
      const { data, error } = await supabase
        .from('user_credits')
        .insert([
          {
            user_id: userId,
            credits: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('❌ Initialize Credits Error:', error)
        return
      }

      console.log('✅ Credits initialized:', data)
      await fetchCredits(userId)
      return data
    } catch (e) {
      console.error('❌ Initialize Credits Error:', e)
    }
  }

  async function checkTables() {
    console.log('🔍 Checking database tables...')
    const results: {[key: string]: boolean | string} = {}

    try {
      // Check user_credits table
      const { error: creditsError } = await supabase
        .from('user_credits')
        .select('count')
        .limit(1)

      results['user_credits table'] = creditsError ? `Error: ${creditsError.message}` : true

      // Check user_images table
      const { error: imagesError } = await supabase
        .from('user_images')
        .select('count')
        .limit(1)

      results['user_images table'] = imagesError ? `Error: ${imagesError.message}` : true

      // Check storage bucket
      const { error: storageError } = await supabase
        .storage
        .from('user-images')
        .list()

      results['storage bucket'] = storageError ? `Error: ${storageError.message}` : true

      setTestResults(results)
    } catch (e: any) {
      console.error('❌ Table Check Error:', e)
      results['General Error'] = e.message
      setTestResults(results)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Database & Backend Test Page</h1>
        
        <div className="mb-6">
          <p className="mb-2">User ID: {userId || 'Not authenticated'}</p>
          <p className="mb-4">Credits: {credits !== null ? credits : 'Loading...'}</p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <Button 
              onClick={() => addCredits(10)}
              variant="outline"
            >
              Add 10 Credits
            </Button>
            
            <Button 
              onClick={() => deductCredits(3)}
              variant="outline"
            >
              Deduct 3 Credits
            </Button>
            
            <Button 
              onClick={uploadTestFile}
              variant="outline"
            >
              Upload Test File
            </Button>
            
            <Button 
              onClick={resetCredits}
              variant="outline"
            >
              Reset Credits
            </Button>
            
            <Button 
              onClick={initializeUserCredits}
              variant="outline"
            >
              Initialize Credits
            </Button>
            
            <Button 
              onClick={checkTables}
              variant="outline"
            >
              Check Tables
            </Button>
          </div>

          <Button 
            onClick={runAllTests}
            disabled={loading}
          >
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results:</h2>
          {Object.entries(testResults).map(([test, result]) => (
            <div 
              key={test}
              className={`p-4 rounded-md ${
                typeof result === 'string' 
                  ? 'bg-red-100 dark:bg-red-900'
                  : result 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
              }`}
            >
              <p className="font-medium">{test}</p>
              {typeof result === 'string' && (
                <p className="text-sm mt-1 text-red-600 dark:text-red-300">{result}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 