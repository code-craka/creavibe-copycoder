-- Create user_consents table
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  status TEXT NOT NULL,
  version TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  
  -- Add a unique constraint to ensure only one active consent per type per user
  UNIQUE(user_id, consent_type, version)
);

-- Enable RLS
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own consents" 
ON user_consents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents" 
ON user_consents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents" 
ON user_consents FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consents" 
ON user_consents FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX idx_user_consents_consent_type ON user_consents(consent_type);
CREATE INDEX idx_user_consents_created_at ON user_consents(created_at);
