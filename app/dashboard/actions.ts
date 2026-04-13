'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function toggleQuestionStatus(questionId: string, isSolved: boolean) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  if (isSolved) {
    // Mark as solved
    const { error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: user.id, 
        question_id: questionId 
      }, { onConflict: 'user_id,question_id' })
    
    if (error) {
      console.error('Error solving question:', error.message)
      return { success: false, error: error.message }
    }
  } else {
    // Unmark as solved
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .match({ 
        user_id: user.id, 
        question_id: questionId 
      })

    if (error) {
      console.error('Error unmarking question:', error.message)
      return { success: false, error: error.message }
    }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
