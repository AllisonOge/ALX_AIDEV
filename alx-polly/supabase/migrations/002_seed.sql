-- Seed data for ALX-Polly database

-- Insert sample users (replace UUIDs with real ones if needed)
INSERT INTO users (id, name, email, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alice Example', 'alice@example.com', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Bob Example', 'bob@example.com', NOW(), NOW());

-- Insert sample polls
INSERT INTO polls (id, question, is_active, is_public, created_by, end_date, created_at, updated_at)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'What is your favorite programming language?', TRUE, TRUE, '11111111-1111-1111-1111-111111111111', NULL, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'What is your favorite color?', TRUE, TRUE, '22222222-2222-2222-2222-222222222222', NULL, NOW(), NOW());

-- Insert sample poll options
INSERT INTO poll_options (id, poll_id, text, created_at, updated_at)
VALUES
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'JavaScript', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Python', NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'TypeScript', NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'Red', NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'Blue', NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Green', NOW(), NOW());

-- Insert sample votes
INSERT INTO votes (id, poll_id, option_id, user_id, created_at, updated_at)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', NOW(), NOW());
