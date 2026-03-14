-- Push Subscriptions for Web Push / Soul Twin Alerts
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  endpoint text NOT NULL,
  subscription jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own push subscription" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Allow service role to read all subscriptions (for sending pushes)
CREATE POLICY "Service role reads all" ON push_subscriptions
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
