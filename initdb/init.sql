-- DATABASE
CREATE DATABASE myapp;
\c myapp;

ALTER DATABASE myapp SET timezone TO 'Europe/Moscow';

-- DOMAIN (email)
-- CREATE DOMAIN email_type AS TEXT
-- CHECK (
--     VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
-- );


-- ENUMS
CREATE TYPE user_role AS ENUM ('admin');


CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'guest',
    username NVARCHAR(128) NOT NULL,
    password_hash NVARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE session (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expired_at TIMESTAMPTZ NOT NULL
);


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