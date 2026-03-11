-- SynchroSoul Direct Messaging Schema
-- Run this in Supabase SQL Editor

-- Conversations table (one row per pair of users)
CREATE TABLE IF NOT EXISTS conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user1_name text DEFAULT '',
  user2_name text DEFAULT '',
  user1_avatar text DEFAULT '',
  user2_avatar text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  last_message_preview text DEFAULT '',
  UNIQUE(user1_id, user2_id)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  angel_number text DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz DEFAULT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages (mark read)"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );

-- Enable Realtime on messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Function to get or create a conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  other_user_id uuid,
  my_name text DEFAULT '',
  my_avatar text DEFAULT '',
  other_name text DEFAULT '',
  other_avatar text DEFAULT ''
) RETURNS uuid AS $$
DECLARE
  conv_id uuid;
  u1 uuid;
  u2 uuid;
BEGIN
  -- Ensure consistent ordering (smaller UUID is user1)
  IF auth.uid() < other_user_id THEN
    u1 := auth.uid();
    u2 := other_user_id;
  ELSE
    u1 := other_user_id;
    u2 := auth.uid();
  END IF;

  -- Try to find existing conversation
  SELECT id INTO conv_id FROM conversations
  WHERE user1_id = u1 AND user2_id = u2;

  -- Create if not exists
  IF conv_id IS NULL THEN
    INSERT INTO conversations (user1_id, user2_id, user1_name, user2_name, user1_avatar, user2_avatar)
    VALUES (
      u1, u2,
      CASE WHEN auth.uid() = u1 THEN my_name ELSE other_name END,
      CASE WHEN auth.uid() = u2 THEN my_name ELSE other_name END,
      CASE WHEN auth.uid() = u1 THEN my_avatar ELSE other_avatar END,
      CASE WHEN auth.uid() = u2 THEN my_avatar ELSE other_avatar END
    )
    RETURNING id INTO conv_id;
  END IF;

  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
