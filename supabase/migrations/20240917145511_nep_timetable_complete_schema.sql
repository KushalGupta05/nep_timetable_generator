-- Location: supabase/migrations/20240917145511_nep_timetable_complete_schema.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: FRESH_PROJECT - Complete system implementation
-- Dependencies: None (fresh database)

-- NEP Timetable Generator - Complete Academic Management System Schema
-- Implements: Authentication, Curriculum, Faculty, Timetable Generation, Data Management

-- 1. EXTENSIONS & CUSTOM TYPES
CREATE TYPE public.user_role AS ENUM ('admin', 'faculty', 'student');
CREATE TYPE public.course_type AS ENUM ('theory', 'practical', 'theory-practical');
CREATE TYPE public.course_category AS ENUM ('major', 'minor', 'ability-enhancement', 'skill', 'value-added', 'foundation');
CREATE TYPE public.day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
CREATE TYPE public.timetable_status AS ENUM ('draft', 'approved', 'active', 'archived');
CREATE TYPE public.conflict_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.faculty_qualification AS ENUM ('phd', 'masters', 'bachelors');
CREATE TYPE public.employment_type AS ENUM ('full-time', 'part-time', 'visiting', 'guest');

-- 2. CORE TABLES (No foreign keys)

-- User profiles (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    phone TEXT,
    avatar_url TEXT,
    department TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Academic programs/degrees
CREATE TABLE public.academic_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    degree_type TEXT NOT NULL, -- B.Tech, B.Ed, M.Ed, etc.
    duration_years INTEGER DEFAULT 4,
    total_semesters INTEGER DEFAULT 8,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    head_id UUID,
    description TEXT,
    building TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Rooms/Venues
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    building TEXT,
    floor TEXT,
    room_type TEXT, -- classroom, lab, auditorium
    capacity INTEGER DEFAULT 30,
    facilities TEXT[], -- array of facilities
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Time slots
CREATE TABLE public.time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_break BOOLEAN DEFAULT false,
    sort_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. DEPENDENT TABLES (With foreign keys to existing tables)

-- Faculty details extending user_profiles
CREATE TABLE public.faculty_profiles (
    id UUID PRIMARY KEY REFERENCES public.user_profiles(id),
    employee_id TEXT UNIQUE,
    qualification public.faculty_qualification DEFAULT 'masters'::public.faculty_qualification,
    specialization TEXT,
    experience_years INTEGER DEFAULT 0,
    employment_type public.employment_type DEFAULT 'full-time'::public.employment_type,
    department_id UUID REFERENCES public.departments(id),
    max_weekly_hours INTEGER DEFAULT 20,
    preferred_subjects TEXT[],
    bio TEXT,
    research_interests TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Student details extending user_profiles  
CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY REFERENCES public.user_profiles(id),
    student_id TEXT UNIQUE,
    program_id UUID REFERENCES public.academic_programs(id),
    current_semester INTEGER DEFAULT 1,
    admission_year INTEGER,
    enrollment_date DATE,
    cgpa DECIMAL(3,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Courses (curriculum management)
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    course_type public.course_type DEFAULT 'theory'::public.course_type,
    category public.course_category DEFAULT 'major'::public.course_category,
    program_id UUID REFERENCES public.academic_programs(id),
    department_id UUID REFERENCES public.departments(id),
    semester INTEGER NOT NULL,
    is_elective BOOLEAN DEFAULT false,
    max_students INTEGER DEFAULT 60,
    faculty_requirements TEXT,
    resource_requirements TEXT,
    prerequisites TEXT[], -- array of prerequisite course codes
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Faculty availability
CREATE TABLE public.faculty_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES public.faculty_profiles(id),
    day_of_week public.day_of_week NOT NULL,
    time_slot_id UUID REFERENCES public.time_slots(id),
    is_available BOOLEAN DEFAULT true,
    preference_level INTEGER DEFAULT 1, -- 1=low, 5=high preference
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Academic semesters/sessions
CREATE TABLE public.academic_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- "2024-25 Odd Semester"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Timetables (main scheduling entity)
CREATE TABLE public.timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    academic_session_id UUID REFERENCES public.academic_sessions(id),
    program_id UUID REFERENCES public.academic_programs(id),
    semester INTEGER NOT NULL,
    timetable_status public.timetable_status DEFAULT 'draft'::public.timetable_status,
    created_by UUID REFERENCES public.user_profiles(id),
    approved_by UUID REFERENCES public.user_profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Individual timetable entries/classes
CREATE TABLE public.timetable_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_id UUID REFERENCES public.timetables(id),
    course_id UUID REFERENCES public.courses(id),
    faculty_id UUID REFERENCES public.faculty_profiles(id),
    room_id UUID REFERENCES public.rooms(id),
    day_of_week public.day_of_week NOT NULL,
    time_slot_id UUID REFERENCES public.time_slots(id),
    section TEXT DEFAULT 'A',
    student_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Timetable conflicts (for AI-assisted conflict detection)
CREATE TABLE public.timetable_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_id UUID REFERENCES public.timetables(id),
    entry_id UUID REFERENCES public.timetable_entries(id),
    conflict_type TEXT NOT NULL, -- 'faculty_clash', 'room_clash', 'student_clash'
    severity public.conflict_severity DEFAULT 'medium'::public.conflict_severity,
    description TEXT NOT NULL,
    suggested_resolution TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Course assignments (faculty to courses)
CREATE TABLE public.course_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id),
    faculty_id UUID REFERENCES public.faculty_profiles(id),
    academic_session_id UUID REFERENCES public.academic_sessions(id),
    is_primary BOOLEAN DEFAULT true,
    assigned_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Data import/export logs
CREATE TABLE public.import_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imported_by UUID REFERENCES public.user_profiles(id),
    import_type TEXT NOT NULL, -- 'courses', 'faculty', 'students'
    file_name TEXT,
    total_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    error_details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. JUNCTION TABLES (Many-to-many relationships)

-- Student course enrollments
CREATE TABLE public.student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.student_profiles(id),
    course_id UUID REFERENCES public.courses(id),
    academic_session_id UUID REFERENCES public.academic_sessions(id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    grade TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. INDEXES
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_faculty_profiles_department ON public.faculty_profiles(department_id);
CREATE INDEX idx_student_profiles_program ON public.student_profiles(program_id);
CREATE INDEX idx_courses_program ON public.courses(program_id);
CREATE INDEX idx_courses_department ON public.courses(department_id);
CREATE INDEX idx_courses_semester ON public.courses(semester);
CREATE INDEX idx_faculty_availability_faculty ON public.faculty_availability(faculty_id);
CREATE INDEX idx_faculty_availability_day ON public.faculty_availability(day_of_week);
CREATE INDEX idx_timetable_entries_timetable ON public.timetable_entries(timetable_id);
CREATE INDEX idx_timetable_entries_course ON public.timetable_entries(course_id);
CREATE INDEX idx_timetable_entries_faculty ON public.timetable_entries(faculty_id);
CREATE INDEX idx_timetable_entries_day_time ON public.timetable_entries(day_of_week, time_slot_id);
CREATE INDEX idx_timetable_conflicts_timetable ON public.timetable_conflicts(timetable_id);
CREATE INDEX idx_course_assignments_course ON public.course_assignments(course_id);
CREATE INDEX idx_course_assignments_faculty ON public.course_assignments(faculty_id);
CREATE INDEX idx_student_enrollments_student ON public.student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_course ON public.student_enrollments(course_id);

-- 6. FUNCTIONS (Must be before RLS policies)

-- Function for automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function to check timetable conflicts
CREATE OR REPLACE FUNCTION public.check_timetable_conflicts(entry_data JSONB)
RETURNS TABLE(conflict_type TEXT, description TEXT, severity TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    -- Check for faculty conflicts
    SELECT 'faculty_clash'::TEXT, 
           'Faculty already assigned at this time'::TEXT,
           'high'::TEXT
    WHERE EXISTS (
        SELECT 1 FROM public.timetable_entries te
        WHERE te.faculty_id = (entry_data->>'faculty_id')::UUID
        AND te.day_of_week = (entry_data->>'day_of_week')::public.day_of_week
        AND te.time_slot_id = (entry_data->>'time_slot_id')::UUID
        AND te.id != COALESCE((entry_data->>'id')::UUID, gen_random_uuid())
    )
    
    UNION ALL
    
    -- Check for room conflicts
    SELECT 'room_clash'::TEXT,
           'Room already booked at this time'::TEXT,
           'medium'::TEXT
    WHERE EXISTS (
        SELECT 1 FROM public.timetable_entries te
        WHERE te.room_id = (entry_data->>'room_id')::UUID
        AND te.day_of_week = (entry_data->>'day_of_week')::public.day_of_week
        AND te.time_slot_id = (entry_data->>'time_slot_id')::UUID
        AND te.id != COALESCE((entry_data->>'id')::UUID, gen_random_uuid())
    );
$$;

-- Function for role-based access using auth metadata
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Function to check faculty role
CREATE OR REPLACE FUNCTION public.is_faculty_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'faculty' 
         OR au.raw_app_meta_data->>'role' = 'faculty')
)
$$;

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES

-- Pattern 1: Core user table (user_profiles) - Simple, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 6A: Admin access using auth metadata for reference data
CREATE POLICY "admin_manage_academic_programs"
ON public.academic_programs
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "public_read_academic_programs"
ON public.academic_programs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "public_read_departments"
ON public.departments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_rooms"
ON public.rooms
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "public_read_rooms"
ON public.rooms
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_time_slots"
ON public.time_slots
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "public_read_time_slots"
ON public.time_slots
FOR SELECT
TO authenticated
USING (true);

-- Faculty profiles - faculty can manage own, admin can manage all
CREATE POLICY "faculty_manage_own_profile"
ON public.faculty_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "admin_manage_faculty_profiles"
ON public.faculty_profiles
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Student profiles - students can manage own, admin can manage all
CREATE POLICY "students_manage_own_profile"
ON public.student_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "admin_manage_student_profiles"
ON public.student_profiles
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Courses - admin can manage, others can read
CREATE POLICY "admin_manage_courses"
ON public.courses
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "public_read_courses"
ON public.courses
FOR SELECT
TO authenticated
USING (true);

-- Faculty availability - faculty manage own, admin can view/manage all
CREATE POLICY "faculty_manage_own_availability"
ON public.faculty_availability
FOR ALL
TO authenticated
USING (faculty_id = auth.uid())
WITH CHECK (faculty_id = auth.uid());

CREATE POLICY "admin_manage_faculty_availability"
ON public.faculty_availability
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Academic sessions - admin manages, others read
CREATE POLICY "admin_manage_academic_sessions"
ON public.academic_sessions
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "public_read_academic_sessions"
ON public.academic_sessions
FOR SELECT
TO authenticated
USING (true);

-- Timetables - admin and faculty can manage, students can read
CREATE POLICY "admin_faculty_manage_timetables"
ON public.timetables
FOR ALL
TO authenticated
USING (public.is_admin_from_auth() OR public.is_faculty_from_auth())
WITH CHECK (public.is_admin_from_auth() OR public.is_faculty_from_auth());

CREATE POLICY "students_read_timetables"
ON public.timetables
FOR SELECT
TO authenticated
USING (true);

-- Timetable entries - admin and faculty can manage, students can read
CREATE POLICY "admin_faculty_manage_timetable_entries"
ON public.timetable_entries
FOR ALL
TO authenticated
USING (public.is_admin_from_auth() OR public.is_faculty_from_auth())
WITH CHECK (public.is_admin_from_auth() OR public.is_faculty_from_auth());

CREATE POLICY "students_read_timetable_entries"
ON public.timetable_entries
FOR SELECT
TO authenticated
USING (true);

-- Timetable conflicts - admin and faculty can manage
CREATE POLICY "admin_faculty_manage_conflicts"
ON public.timetable_conflicts
FOR ALL
TO authenticated
USING (public.is_admin_from_auth() OR public.is_faculty_from_auth())
WITH CHECK (public.is_admin_from_auth() OR public.is_faculty_from_auth());

-- Course assignments - admin manages, faculty can read own
CREATE POLICY "admin_manage_course_assignments"
ON public.course_assignments
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "faculty_read_own_assignments"
ON public.course_assignments
FOR SELECT
TO authenticated
USING (faculty_id = auth.uid());

-- Import logs - admin only
CREATE POLICY "admin_manage_import_logs"
ON public.import_logs
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Student enrollments - students read own, admin manages all
CREATE POLICY "students_read_own_enrollments"
ON public.student_enrollments
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "admin_manage_student_enrollments"
ON public.student_enrollments
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- 9. TRIGGERS
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_timetables_updated_at
    BEFORE UPDATE ON public.timetables
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 10. MOCK DATA FOR DEMO
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    faculty1_uuid UUID := gen_random_uuid();
    faculty2_uuid UUID := gen_random_uuid();
    student_uuid UUID := gen_random_uuid();
    
    program1_uuid UUID := gen_random_uuid();
    program2_uuid UUID := gen_random_uuid();
    
    dept1_uuid UUID := gen_random_uuid();
    dept2_uuid UUID := gen_random_uuid();
    
    room1_uuid UUID := gen_random_uuid();
    room2_uuid UUID := gen_random_uuid();
    room3_uuid UUID := gen_random_uuid();
    
    time1_uuid UUID := gen_random_uuid();
    time2_uuid UUID := gen_random_uuid();
    time3_uuid UUID := gen_random_uuid();
    time4_uuid UUID := gen_random_uuid();
    
    course1_uuid UUID := gen_random_uuid();
    course2_uuid UUID := gen_random_uuid();
    course3_uuid UUID := gen_random_uuid();
    
    session_uuid UUID := gen_random_uuid();
    timetable_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@nep.edu.in', crypt('Admin@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Administrator", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (faculty1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'faculty@nep.edu.in', crypt('Faculty@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Rajesh Sharma", "role": "faculty"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (faculty2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'priya.gupta@nep.edu.in', crypt('Faculty@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Prof. Priya Gupta", "role": "faculty"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student@nep.edu.in', crypt('Student@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Amit Kumar", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert academic programs
    INSERT INTO public.academic_programs (id, code, name, degree_type, duration_years, total_semesters) VALUES
        (program1_uuid, 'BTECHCSE', 'Bachelor of Technology - Computer Science', 'B.Tech', 4, 8),
        (program2_uuid, 'BED', 'Bachelor of Education', 'B.Ed', 2, 4);

    -- Insert departments
    INSERT INTO public.departments (id, code, name, head_id, building) VALUES
        (dept1_uuid, 'CSE', 'Computer Science and Engineering', faculty1_uuid, 'Academic Block A'),
        (dept2_uuid, 'EDU', 'Education', faculty2_uuid, 'Academic Block B');

    -- Insert rooms
    INSERT INTO public.rooms (id, code, name, building, floor, room_type, capacity, facilities) VALUES
        (room1_uuid, 'CS101', 'Computer Science Lab 1', 'Academic Block A', 'Ground Floor', 'lab', 30, ARRAY['Computers', 'Projector', 'AC', 'WiFi']),
        (room2_uuid, 'LH201', 'Lecture Hall 201', 'Academic Block A', 'Second Floor', 'classroom', 60, ARRAY['Projector', 'AC', 'WiFi', 'Smart Board']),
        (room3_uuid, 'AUD', 'Main Auditorium', 'Main Building', 'Ground Floor', 'auditorium', 200, ARRAY['Audio System', 'Projector', 'AC', 'Stage']);

    -- Insert time slots
    INSERT INTO public.time_slots (id, name, start_time, end_time, duration_minutes, sort_order) VALUES
        (time1_uuid, '09:00 - 10:00', '09:00:00', '10:00:00', 60, 1),
        (time2_uuid, '10:00 - 11:00', '10:00:00', '11:00:00', 60, 2),
        (time3_uuid, '11:00 - 12:00', '11:00:00', '12:00:00', 60, 3),
        (time4_uuid, '14:00 - 15:00', '14:00:00', '15:00:00', 60, 4);

    -- Insert courses
    INSERT INTO public.courses (id, course_code, title, description, credits, course_type, category, program_id, department_id, semester, max_students, created_by) VALUES
        (course1_uuid, 'CS301', 'Data Structures and Algorithms', 'Fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs.', 4, 'theory', 'major', program1_uuid, dept1_uuid, 5, 60, admin_uuid),
        (course2_uuid, 'CS302L', 'Data Structures Lab', 'Practical implementation of data structures concepts learned in theory.', 2, 'practical', 'major', program1_uuid, dept1_uuid, 5, 30, admin_uuid),
        (course3_uuid, 'ENG201', 'Technical Communication', 'Development of technical writing and presentation skills for engineering professionals.', 2, 'theory', 'ability-enhancement', program1_uuid, dept2_uuid, 3, 50, admin_uuid);

    -- Insert faculty profiles (will be auto-created via trigger, but we need the extended info)
    INSERT INTO public.faculty_profiles (id, employee_id, qualification, specialization, experience_years, department_id, max_weekly_hours) VALUES
        (faculty1_uuid, 'FAC001', 'phd', 'Computer Science', 10, dept1_uuid, 20),
        (faculty2_uuid, 'FAC002', 'masters', 'English Literature', 8, dept2_uuid, 18);

    -- Insert student profile
    INSERT INTO public.student_profiles (id, student_id, program_id, current_semester, admission_year) VALUES
        (student_uuid, 'STU001', program1_uuid, 5, 2022);

    -- Insert academic session
    INSERT INTO public.academic_sessions (id, name, start_date, end_date, is_active) VALUES
        (session_uuid, '2024-25 Odd Semester', '2024-07-01', '2024-12-31', true);

    -- Insert faculty availability (sample)
    INSERT INTO public.faculty_availability (faculty_id, day_of_week, time_slot_id, is_available, preference_level) VALUES
        (faculty1_uuid, 'monday', time1_uuid, true, 5),
        (faculty1_uuid, 'monday', time2_uuid, true, 4),
        (faculty1_uuid, 'tuesday', time1_uuid, true, 3),
        (faculty2_uuid, 'wednesday', time3_uuid, true, 5),
        (faculty2_uuid, 'thursday', time1_uuid, true, 4);

    -- Insert course assignments
    INSERT INTO public.course_assignments (course_id, faculty_id, academic_session_id, assigned_by) VALUES
        (course1_uuid, faculty1_uuid, session_uuid, admin_uuid),
        (course2_uuid, faculty1_uuid, session_uuid, admin_uuid),
        (course3_uuid, faculty2_uuid, session_uuid, admin_uuid);

    -- Insert sample timetable
    INSERT INTO public.timetables (id, name, academic_session_id, program_id, semester, timetable_status, created_by) VALUES
        (timetable_uuid, 'B.Tech CSE Semester 5 - 2024-25 Odd', session_uuid, program1_uuid, 5, 'active', admin_uuid);

    -- Insert timetable entries
    INSERT INTO public.timetable_entries (timetable_id, course_id, faculty_id, room_id, day_of_week, time_slot_id, section, student_count) VALUES
        (timetable_uuid, course1_uuid, faculty1_uuid, room2_uuid, 'monday', time1_uuid, 'A', 48),
        (timetable_uuid, course2_uuid, faculty1_uuid, room1_uuid, 'monday', time2_uuid, 'A', 28),
        (timetable_uuid, course3_uuid, faculty2_uuid, room2_uuid, 'wednesday', time3_uuid, 'A', 45);

    -- Insert student enrollment
    INSERT INTO public.student_enrollments (student_id, course_id, academic_session_id) VALUES
        (student_uuid, course1_uuid, session_uuid),
        (student_uuid, course2_uuid, session_uuid),
        (student_uuid, course3_uuid, session_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;