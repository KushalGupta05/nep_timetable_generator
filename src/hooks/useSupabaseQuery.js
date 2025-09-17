import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseQuery = (table, options = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase?.from(table)?.select(options?.select || '*')

      // Apply filters
      if (options?.filters) {
        Object.entries(options?.filters)?.forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            query = query?.eq(key, value)
          }
        })
      }

      // Apply search
      if (options?.search) {
        const { column, term } = options?.search
        query = query?.ilike(column, `%${term}%`)
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query?.order(
          options?.orderBy?.column,
          { ascending: options?.orderBy?.ascending ?? true }
        )
      }

      // Apply pagination
      if (options?.range) {
        query = query?.range(options?.range?.from, options?.range?.to)
      }

      const { data: result, error: queryError } = await query

      if (queryError) throw queryError

      setData(result || [])
    } catch (err) {
      setError(err?.message || 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [table, JSON.stringify(options)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export const useSupabaseMutation = (table) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (operation, data, options = {}) => {
    try {
      setLoading(true)
      setError(null)

      let query

      switch (operation) {
        case 'insert':
          query = supabase?.from(table)?.insert([data])?.select()
          break
        case 'update':
          query = supabase?.from(table)?.update(data)?.eq('id', options?.id)?.select()
          break
        case 'delete':
          query = supabase?.from(table)?.delete()?.eq('id', options?.id)
          break
        case 'upsert':
          query = supabase?.from(table)?.upsert([data])?.select()
          break
        default:
          throw new Error(`Invalid operation: ${operation}`)
      }

      const { data: result, error: mutationError } = await query

      if (mutationError) throw mutationError

      return { data: result, error: null }
    } catch (err) {
      const errorMessage = err?.message || 'An error occurred'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}