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
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      await fetchCredits(user.id)
    }
  }

  async function fetchCredits(uid: string) {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', uid)
      .single()
    
    if (data) {
      setCredits(data.credits)
    }
  }

  async function runAllTests() {
    setLoading(true)
    const results: {[key: string]: boolean | string} = {}

    try {
      // Test 1: Check Authentication
      const { data: { user } } = await supabase.auth.getUser()
      results['Authentication'] = !!user

      // Test 2: Check Credits Table
      if (user) {
        const { data: credits, error: creditsError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        results['Credits Table'] = !!credits
        if (creditsError) results['Credits Error'] = creditsError.message
      }

      // Test 3: Test Image Upload
      try {
        const testBlob = new Blob(['test'], { type: 'image/png' })
        const testFile = new File([testBlob], 'test.png', { type: 'image/png' })
        
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('user-images')
          .upload(`test/${Date.now()}.png`, testFile)
        
        results['Storage Upload'] = !!uploadData
        
        if (uploadData) {
          // Test cleanup - delete test file
          await supabase
            .storage
            .from('user-images')
            .remove([uploadData.path])
        }
        
        if (uploadError) results['Upload Error'] = uploadError.message
      } catch (e: any) {
        results['Upload Error'] = e.message
      }

      // Test 4: Test User Images Table
      if (user) {
        const { data: imageInsert, error: insertError } = await supabase
          .from('user_images')
          .insert({
            user_id: user.id,
            image_url: 'test_url',
            prompt: 'test prompt',
            style: 'test style',
            format: 'PNG',
            keywords: ['test']
          })
          .select()
          .single()
        
        results['Image Insert'] = !!imageInsert
        if (insertError) results['Insert Error'] = insertError.message
        
        // Cleanup test image record
        if (imageInsert) {
          await supabase
            .from('user_images')
            .delete()
            .eq('id', imageInsert.id)
        }
      }

    } catch (e: any) {
      results['General Error'] = e.message
    }

    setTestResults(results)
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Database & Backend Test Page</h1>
        
        <div className="mb-6">
          <p className="mb-2">User ID: {userId || 'Not authenticated'}</p>
          <p className="mb-4">Credits: {credits !== null ? credits : 'Loading...'}</p>
          
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