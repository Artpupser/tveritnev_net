-- DATABASE
CREATE DATABASE myapp;
\c myapp;

ALTER DATABASE myapp SET timezone TO 'Europe/Moscow';

CREATE TYPE user_role AS ENUM ('member', 'admin')


CREATE TABLE users {
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username varchar(128) NOT NULL,
    password varchar(256) NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
}


CREATE TABLE session (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expired_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE configs {
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(32) NOT NULL,
    json TEXT NOT NULL,
}

-- TRIGGERS: automatic clear sessions

CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM session
    WHERE expired_at < now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_cleanup_sessions
AFTER INSERT OR UPDATE ON session
FOR EACH STATEMENT
EXECUTE FUNCTION delete_expired_sessions();