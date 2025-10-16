import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)

  // 检查用户登录状态
  const checkAuthState = async () => {
    isLoading.value = true
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null
    } catch (error) {
      console.error('检查登录状态失败:', error)
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  // 用户登录
  const login = async (email, password) => {
    isLoading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      user.value = data.user
      return { success: true, user: data.user }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // 用户注册
  const register = async (email, password) => {
    isLoading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      return { success: true, user: data.user }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // 用户退出
  const logout = async () => {
    isLoading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      user.value = null
      return { success: true }
    } catch (error) {
      console.error('退出失败:', error)
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // 监听认证状态变化
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
  }

  return {
    user,
    isLoading,
    checkAuthState,
    login,
    register,
    logout,
    setupAuthListener
  }
})