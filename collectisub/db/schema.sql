DROP TABLE IF EXISTS projects_meta CASCADE;
CREATE TABLE "projects_meta" (
    projId     text primary key,
    filename   text not null,
    format     text not null
);

DROP TABLE IF EXISTS projects_data;
CREATE TABLE "projects_data" (
    projId     text primary key references projects_meta,
    timestamp  bigint not null,
    parsed     jsonb
);

DROP TABLE IF EXISTS projects_originaldata;
CREATE TABLE "projects_originaldata" (
    projId     text primary key references projects_meta,
    timestamp  bigint not null,
    parsed     jsonb not null
);

DROP TABLE IF EXISTS users;
CREATE TABLE "users" (
    username  text primary key,
    secret    text,
    projects  text[]
);
