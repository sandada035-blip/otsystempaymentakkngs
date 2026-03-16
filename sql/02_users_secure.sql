create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid references schools(id),
  email text unique not null,
  password text,
  password_hash text,
  role text default 'user',
  created_at timestamp default now()
);

insert into users (school_id, email, password, role)
select s.id, 'admin@school.com', '123456', 'admin'
from schools s
limit 1
on conflict (email) do nothing;

insert into users (school_id, email, password, role)
select s.id, 'user@school.com', '123456', 'user'
from schools s
limit 1
on conflict (email) do nothing;
