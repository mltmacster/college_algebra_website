
-- SQL script to create additional instructor accounts
-- Connect to your PostgreSQL database and run these commands

-- Example: Create instructor account
INSERT INTO "User" (id, name, "firstName", "lastName", email, password, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Dr. Michael Chen',
  'Michael', 
  'Chen',
  'instructor2@university.edu',
  '$2a$12$LQv3c1yqBwEHFuAGchDtFu.G2V7J8VxZ4B9nF7q9Y8W1qV0B.wW.C', -- bcrypt hash of 'instructor456'
  NOW(),
  NOW()
);

-- Add more instructors as needed
INSERT INTO "User" (id, name, "firstName", "lastName", email, password, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Prof. Emily Rodriguez',
  'Emily',
  'Rodriguez', 
  'instructor3@college.edu',
  '$2a$12$LQv3c1yqBwEHFuAGchDtFu.G2V7J8VxZ4B9nF7q9Y8W1qV0B.wW.C', -- bcrypt hash of 'instructor789'
  NOW(),
  NOW()
);
