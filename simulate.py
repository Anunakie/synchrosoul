#!/usr/bin/env python3
"""
SynchroSoul Multi-User Simulation Test Script
Runs automated tests simulating multiple users interacting with the app.

Usage:
  python simulate.py soul-twin 1111    # Make test bots log 1111 (triggers your sync match)
  python simulate.py feed              # Bots post to cosmic feed  
  python simulate.py message <user_id> # Bot sends you a message
  python simulate.py status            # Check all test users
  python simulate.py reset-logs        # Clear all bot angel logs (fresh start)
"""

import sys
import requests
import json
from datetime import datetime, timezone, timedelta
import random

SUPABASE_URL = 'https://btopllnsyslhjictcznm.supabase.co'
SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0b3BsbG5zeXNsaGppY3Rjem5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYzMTU4MSwiZXhwIjoyMDg3MjA3NTgxfQ.jr7L3y5oJpcvGRJHrzYI5yTUnivYZC13Iw-YDUDkG4U'

BOT_EMAILS = [
    'luna.testbot@synchrosoul.app',
    'sol.testbot@synchrosoul.app',
    'nova.testbot@synchrosoul.app',
    'ember.testbot@synchrosoul.app',
    'zion.testbot@synchrosoul.app',
]

headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

def get_user_ids():
    r = requests.get(f'{SUPABASE_URL}/auth/v1/admin/users?per_page=50', headers=headers)
    all_users = r.json().get('users', [])
    return {u['email']: u['id'] for u in all_users if u.get('email')}

def cmd_status():
    email_to_id = get_user_ids()
    print("\n=== SynchroSoul Test Bot Status ===")
    for email in BOT_EMAILS:
        uid = email_to_id.get(email)
        if not uid:
            print(f"  {email}: NOT FOUND")
            continue
        # Get their recent logs
        r = requests.get(
            f'{SUPABASE_URL}/rest/v1/angel_logs?user_id=eq.{uid}&order=created_at.desc&limit=3',
            headers=headers
        )
        logs = r.json() if r.status_code == 200 else []
        # Get profile
        r2 = requests.get(
            f'{SUPABASE_URL}/rest/v1/profiles?id=eq.{uid}&select=display_name,subscription_tier',
            headers=headers
        )
        profile = r2.json()[0] if r2.status_code == 200 and r2.json() else {}
        name = profile.get('display_name', email.split('.')[0])
        tier = profile.get('subscription_tier', 'unknown')
        recent = [l.get('number') for l in logs]
        print(f"  {name} ({tier}): recent logs = {recent}")
    print()

def cmd_soul_twin(number):
    """Make 3 test bots log the given number RIGHT NOW to trigger sync matches"""
    email_to_id = get_user_ids()
    now = datetime.now(timezone.utc)

    thoughts = [
        f'Seeing {number} right as I think about connection',
        f'{number} appeared while I was reading',
        f'The number {number} keeps showing up for me',
        f'Another {number} sighting - this feels significant',
    ]

    print(f"\n=== Triggering Soul Twin Match for {number} ===")
    for email in BOT_EMAILS[:3]:  # Use 3 bots
        uid = email_to_id.get(email)
        if not uid:
            continue
        log = {
            'user_id': uid,
            'number': number,
            'thought': random.choice(thoughts),
            'created_at': (now - timedelta(minutes=random.randint(1, 25))).isoformat(),
        }
        r = requests.post(f'{SUPABASE_URL}/rest/v1/angel_logs', headers=headers, json=log)
        name = email.split('.')[0].capitalize()
        if r.status_code in [200, 201, 204]:
            print(f"  {name} logged {number} at T-{log['created_at'][-14:-9]}")
        else:
            print(f"  {name} error: {r.status_code}")

    print(f"\n  Go to /dashboard/sync NOW and log {number}!")
    print(f"  3 bots logged it in the last 25 minutes - you should see matches!\n")

def cmd_feed():
    """Bots post cosmic content to the social feed"""
    email_to_id = get_user_ids()
    now = datetime.now(timezone.utc)

    posts = [
        "Just saw 1111 right when I made a decision - been putting it off for weeks. The timing was perfect. 🌟",
        '333 three times today - once on a receipt, once on a license plate, and once on a building number. Anyone else tracking these?',
        'Had the most vivid dream about flying between two versions of reality. Woke up seeing 777. This app is helping me see the patterns.',
        'New to tracking angel numbers but 555 has shown up 4 times this week during major life changes. Just shared my first dream too!',
        'The sync matching feature just connected me with someone who saw the exact same number at the exact same time. Mind blown.',
    ]

    print("\n=== Bots Posting to Cosmic Feed ===")
    for i, email in enumerate(BOT_EMAILS):
        uid = email_to_id.get(email)
        if not uid:
            continue
        # Get display name
        r2 = requests.get(
            f'{SUPABASE_URL}/rest/v1/profiles?id=eq.{uid}&select=display_name,avatar_color',
            headers=headers
        )
        profile = r2.json()[0] if r2.status_code == 200 and r2.json() else {}

        post = {
            'user_id': uid,
            'content': posts[i],
            'author_name': profile.get('display_name', 'Bot'),
            'author_color': profile.get('avatar_color', '#9b59b6'),
            'created_at': (now - timedelta(minutes=random.randint(5, 60))).isoformat(),
        }
        r = requests.post(f'{SUPABASE_URL}/rest/v1/posts', headers=headers, json=post)
        name = profile.get('display_name', email.split('.')[0])
        if r.status_code in [200, 201, 204]:
            print(f"  {name} posted: \n\t'{posts[i][:60]}...'")
        else:
            print(f"  {name} error: {r.status_code} {r.text[:80]}")

    print("\n  Refresh /dashboard/feed to see bot posts!\n")

def cmd_reset_logs():
    """Clear all bot angel number logs for a fresh test"""
    email_to_id = get_user_ids()
    print("\n=== Clearing Bot Angel Logs ===")
    for email in BOT_EMAILS:
        uid = email_to_id.get(email)
        if not uid:
            continue
        r = requests.delete(
            f'{SUPABASE_URL}/rest/v1/angel_logs?user_id=eq.{uid}',
            headers=headers
        )
        name = email.split('.')[0].capitalize()
        print(f"  {name}: logs cleared ({r.status_code})")
    print()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    cmd = sys.argv[1]
    if cmd == 'status':
        cmd_status()
    elif cmd == 'soul-twin':
        number = sys.argv[2] if len(sys.argv) > 2 else '1111'
        cmd_soul_twin(number)
    elif cmd == 'feed':
        cmd_feed()
    elif cmd == 'reset-logs':
        cmd_reset_logs()
    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
