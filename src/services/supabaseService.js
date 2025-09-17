import { supabase } from '../lib/supabase';

// Generic service class for CRUD operations
class SupabaseService {
  constructor(tableName) {
    this.tableName = tableName
  }

  async create(data) {
    try {
      const { data: result, error } = await supabase?.from(this.tableName)?.insert([data])?.select()?.single()

      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  async getAll(options = {}) {
    try {
      let query = supabase?.from(this.tableName)?.select(options?.select || '*')

      if (options?.filters) {
        Object.entries(options?.filters)?.forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            query = query?.eq(key, value)
          }
        })
      }

      if (options?.orderBy) {
        query = query?.order(
          options?.orderBy?.column,
          { ascending: options?.orderBy?.ascending ?? true }
        )
      }

      if (options?.range) {
        query = query?.range(options?.range?.from, options?.range?.to)
      }

      const { data, error, count } = await query

      if (error) throw error
      return { data: data || [], error: null, count }
    } catch (error) {
      return { data: [], error, count: null }
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase?.from(this.tableName)?.select('*')?.eq('id', id)?.single()

      if (error && error?.code !== 'PGRST116') throw error
      return { data: data || null, error: error?.code === 'PGRST116' ? null : error }
    } catch (error) {
      return { data: null, error }
    }
  }

  async update(id, data) {
    try {
      const { data: result, error } = await supabase?.from(this.tableName)?.update(data)?.eq('id', id)?.select()?.single()

      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  async delete(id) {
    try {
      const { data, error } = await supabase?.from(this.tableName)?.delete()?.eq('id', id)?.select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Specific service instances
export const coursesService = new SupabaseService('courses')
export const facultyService = new SupabaseService('faculty_profiles')
export const timetableService = new SupabaseService('timetables')
export const timetableEntriesService = new SupabaseService('timetable_entries')
export const academicProgramsService = new SupabaseService('academic_programs')
export const departmentsService = new SupabaseService('departments')
export const roomsService = new SupabaseService('rooms')
export const timeSlotsService = new SupabaseService('time_slots')

// Enhanced course service with relationships
export const courseService = {
  async getAllWithRelations() {
    try {
      const { data, error } = await supabase?.from('courses')?.select(`
          *,
          program:academic_programs(id, name, code),
          department:departments(id, name, code),
          created_by_user:user_profiles!created_by(full_name)
        `)?.order('created_at', { ascending: false })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async getByProgram(programId, semester = null) {
    try {
      let query = supabase?.from('courses')?.select(`
          *,
          program:academic_programs(id, name, code),
          department:departments(id, name, code)
        `)?.eq('program_id', programId)

      if (semester) {
        query = query?.eq('semester', semester)
      }

      const { data, error } = await query?.order('semester', { ascending: true })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}

// Timetable service with conflict detection
export const timetableServiceExtended = {
  async createEntry(entryData) {
    try {
      // Check for conflicts before creating
      const { data: conflicts } = await supabase?.rpc('check_timetable_conflicts', { entry_data: entryData })

      if (conflicts && conflicts?.length > 0) {
        return { 
          data: null, 
          error: { message: 'Conflicts detected', conflicts } 
        }
      }

      const { data, error } = await supabase?.from('timetable_entries')?.insert([entryData])?.select(`
          *,
          course:courses(course_code, title),
          faculty:faculty_profiles!inner(*, user_profiles!inner(full_name)),
          room:rooms(code, name),
          time_slot:time_slots(name, start_time, end_time)
        `)?.single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async getTimetableWithEntries(timetableId) {
    try {
      const { data, error } = await supabase?.from('timetable_entries')?.select(`
          *,
          course:courses(course_code, title, credits),
          faculty:faculty_profiles!inner(*, user_profiles!inner(full_name)),
          room:rooms(code, name, capacity),
          time_slot:time_slots(name, start_time, end_time)
        `)?.eq('timetable_id', timetableId)?.order('day_of_week')

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}

// Faculty service with availability
export const facultyServiceExtended = {
  async getFacultyWithAvailability() {
    try {
      const { data, error } = await supabase?.from('faculty_profiles')?.select(`
          *,
          user_profiles!inner(full_name, email, phone),
          department:departments(name, code),
          faculty_availability(day_of_week, time_slot_id, is_available, preference_level)
        `)?.eq('user_profiles.is_active', true)

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async updateAvailability(facultyId, availabilityData) {
    try {
      // Delete existing availability
      await supabase?.from('faculty_availability')?.delete()?.eq('faculty_id', facultyId)

      // Insert new availability
      const { data, error } = await supabase?.from('faculty_availability')?.insert(availabilityData?.map(item => ({ ...item, faculty_id: facultyId })))?.select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export default SupabaseService