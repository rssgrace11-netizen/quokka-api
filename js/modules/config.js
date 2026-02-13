export const PROJECT_URL = 'https://ugrvxaixtxaohjlxffbp.supabase.co';
export const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncnZ4YWl4dHhhb2hqbHhmZmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NDUxOTQsImV4cCI6MjA4NjUyMTE5NH0.kwknHwv7FOpay4gPZqgDUyXDBRo84UTBkRryB2RJJ5w';

// Supabase 클라이언트 생성 (window.supabase)
const { createClient } = window.supabase;
export const _supabase = createClient(PROJECT_URL, API_KEY);
