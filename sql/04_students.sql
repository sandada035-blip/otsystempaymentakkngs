create extension if not exists "uuid-ossp";

create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid references schools(id),
  name text,
  gender text,
  grade text,
  teacher text,
  created_at timestamp default now()
);
