-- DATABASE
CREATE DATABASE myapp;
\c myapp;

ALTER DATABASE myapp SET timezone TO 'Europe/Moscow';


CREATE TABLE moderator (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username NVARCHAR(128) NOT NULL,
    password_hash NVARCHAR(128) NOT NULL,
);


CREATE TABLE session (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expired_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE configuration {
    panel_json TEXT NOT NULL,
    settings_json TEXT NOT NULL,
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