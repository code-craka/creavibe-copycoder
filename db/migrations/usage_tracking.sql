-- Create usage_logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create usage_metrics table for aggregated metrics
CREATE TABLE IF NOT EXISTS usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type VARCHAR(50) NOT NULL,
  current_usage INTEGER NOT NULL DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_type)
);

-- Create function to log usage
CREATE OR REPLACE FUNCTION log_usage(
  p_user_id UUID,
  p_resource_type VARCHAR,
  p_quantity INTEGER,
  p_metadata JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Insert into usage logs
  INSERT INTO usage_logs (user_id, resource_type, quantity, metadata)
  VALUES (p_user_id, p_resource_type, p_quantity, p_metadata);
  
  -- Update usage metrics
  INSERT INTO usage_metrics (user_id, resource_type, current_usage, updated_at)
  VALUES (p_user_id, p_resource_type, p_quantity, NOW())
  ON CONFLICT (user_id, resource_type)
  DO UPDATE SET
    current_usage = usage_metrics.current_usage + p_quantity,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to reset usage metrics (e.g., for monthly reset)
CREATE OR REPLACE FUNCTION reset_usage_metrics(
  p_user_id UUID,
  p_resource_type VARCHAR DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  IF p_resource_type IS NULL THEN
    -- Reset all resource types for the user
    UPDATE usage_metrics
    SET current_usage = 0, last_reset = NOW(), updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Reset specific resource type for the user
    UPDATE usage_metrics
    SET current_usage = 0, last_reset = NOW(), updated_at = NOW()
    WHERE user_id = p_user_id AND resource_type = p_resource_type;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

-- Users can only read their own usage logs
CREATE POLICY usage_logs_select_policy ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only read their own usage metrics
CREATE POLICY usage_metrics_select_policy ON usage_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update usage logs and metrics
CREATE POLICY usage_logs_insert_policy ON usage_logs
  FOR INSERT WITH CHECK (auth.jwt() ? 'service_role');

CREATE POLICY usage_metrics_insert_policy ON usage_metrics
  FOR INSERT WITH CHECK (auth.jwt() ? 'service_role');

CREATE POLICY usage_metrics_update_policy ON usage_metrics
  FOR UPDATE USING (auth.jwt() ? 'service_role');
