create extension if not exists "uuid-ossp";

create table if not exists schools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp default now()
);

insert into schools (name)
values ('Main School')
on conflict do nothing;
