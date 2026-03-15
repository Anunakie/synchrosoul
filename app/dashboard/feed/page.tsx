'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllPostsFromDB, FeedPost, getLiveSyncMatches, LiveSyncMatch } from '@/lib/supabase-db';
import { getPosts, savePost, SocialPost } from '@/lib/social-storage';
import { isAuthenticated } from '@/lib/supabase-db';
import { createClient } from '@/lib/supabase/client';
import ReportModal from '@/components/ReportModal';

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

function PostCard({ post, onResonate }: { post: FeedPost | SocialPost; onResonate?: (id: string) => void }) {
  const isFeed = 'authorName' in post;
  const name = isFeed ? (post as FeedPost).authorName : (post as SocialPost).authorName;
  const color = isFeed ? (post as FeedPost).authorColor : (post as SocialPost).authorColor;
  const avatar = isFeed ? (post as FeedPost).authorAvatar : (post as SocialPost).authorImage;
  const number = isFeed ? (post as FeedPost).angelNumber : (post as SocialPost).angelNumber;
  const content = post.content;
  const ts = isFeed ? (post as FeedPost).createdAt : (post as SocialPost).createdAt;
  const resonates = isFeed ? (post as FeedPost).resonates : (post as SocialPost).resonates;
  const isOwn = isFeed ? (post as FeedPost).isOwn : (post as SocialPost).isOwn;
  const [resonated, setResonated] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleResonate = () => {
    if (resonated || isOwn) return;
    setResonated(true);
    onResonate?.(post.id);
  };

  return (
    <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '20px', padding: '1.25rem', backdropFilter: 'blur(16px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
          background: avatar ? 'transparent' : color,
          border: '2px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', overflow: 'hidden' }}>
          {avatar ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '✨'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{name}</span>
            {isOwn && <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px',
              background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>you</span>}
            {number && <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '999px',
              background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>{number}</span>}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{timeAgo(ts)}</span>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>{content}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={handleResonate} disabled={isOwn}
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem',
            borderRadius: '999px', border: 'none', cursor: isOwn ? 'default' : 'pointer',
            background: resonated ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)',
            color: resonated ? '#c9a84c' : 'rgba(255,255,255,0.4)', fontSize: '0.8rem',
            transition: 'all 0.2s' }}>
          <span>{resonated ? '❆' : '❇'}</span>
          <span>{(resonates || 0) + (resonated ? 1 : 0)} resonates</span>
        </button>
        {!isOwn && (
          <button onClick={() => setShowReport(true)}
            title="Report this post"
            style={{ marginLeft: 'auto', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.85rem',
              padding: '0.3rem 0.5rem', borderRadius: '0.4rem',
              transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(239,68,68,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          >⚑</button>
        )}
      </div>
      {showReport && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="post"
          targetId={post.id}
          targetName={name}
        />
      )}
    </div>
  );
}

export default function FeedPage() {
  const [view, setView] = useState<'feed' | 'sync'>('feed');
  const [posts, setPosts] = useState<(FeedPost | SocialPost)[]>([]);
  const [syncMatches, setSyncMatches] = useState<LiveSyncMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReal, setIsReal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newPostCount, setNewPostCount] = useState(0);
  const channelRef = useRef<any>(null);
  const postsRef = useRef<(FeedPost | SocialPost)[]>([]);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const authed = await isAuthenticated();
      if (authed) {
        const real = await getAllPostsFromDB(50);
        const myPosts = await getPosts();
        const myOwnPosts = myPosts.filter(p => p.isOwn);
        const realIds = new Set(real.map(p => p.id));
        const missingOwn = myOwnPosts.filter(p => !realIds.has(p.id));
        const merged = [...missingOwn, ...real].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(merged);
        postsRef.current = merged;
        setIsReal(real.length > 0);
        setLoading(false);
        return;
      }
    } catch {}
    const local = await getPosts();
    setPosts(local);
    postsRef.current = local;
    setLoading(false);
  }, []);

  const loadSync = useCallback(async () => {
    setLoading(true);
    try {
      const real = await getLiveSyncMatches();
      setSyncMatches(real);
    } catch {}
    setLoading(false);
  }, []);

  // Set up Realtime subscription for live feed
  useEffect(() => {
    if (view !== 'feed') return;
    loadFeed().then(() => {
      try {
        const supabase = createClient();
        const channel = supabase
          .channel('feed-posts')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'posts',
            filter: 'is_public=eq.true',
          }, (payload: any) => {
            const newPost: FeedPost = {
              id: payload.new.id,
              userId: payload.new.user_id,
              content: payload.new.content,
              angelNumber: payload.new.angel_number,
              createdAt: payload.new.created_at,
              resonates: 0,
              authorName: payload.new.author_name || 'Starseed',
              authorColor: '#9b59b6',
              authorAvatar: payload.new.author_image || null,
              authorLifePath: null,
              isOwn: false,
            };
            // Check if already in list
            const exists = postsRef.current.some(p => p.id === newPost.id);
            if (!exists) {
              setNewPostCount(c => c + 1);
              const updated = [newPost, ...postsRef.current];
              postsRef.current = updated;
              setPosts(updated);
            }
          })
          .subscribe();
        channelRef.current = channel;
      } catch (e) {
        console.error('Feed Realtime error:', e);
      }
    });

    return () => {
      if (channelRef.current) {
        try { createClient().removeChannel(channelRef.current); } catch {}
        channelRef.current = null;
      }
    };
  }, [view, loadFeed]);

  useEffect(() => {
    if (view === 'sync') loadSync();
  }, [view, loadSync]);

  const handleResonate = async (id: string) => {
    try {
      const { resonatePostDB } = await import('@/lib/supabase-db');
      await resonatePostDB(id);
    } catch {}
  };

  const filtered = view === 'feed' ? posts.filter(p => {
    if (filter === 'mine') return 'isOwn' in p ? (p as FeedPost).isOwn : (p as SocialPost).isOwn;
    if (filter === 'numbers') return ('angelNumber' in p ? (p as FeedPost).angelNumber : (p as SocialPost).angelNumber);
    return true;
  }) : syncMatches;

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 6rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌌</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Cosmic Feed</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.3rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
            {isReal ? '❆ Live posts from your cosmic community' : '❆ Your local posts'}
          </p>
          {isReal && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', fontSize: '0.7rem' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80',
                boxShadow: '0 0 4px #4ade80', animation: 'pulse 2s infinite' }} />
              Live
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
        padding: '4px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
        {[['feed','🌌 Feed'],['sync','🔮 Live Sync']].map(([v, label]) => (
          <button key={v} onClick={() => { setView(v as any); setNewPostCount(0); }}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '9px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
              background: view === v ? 'rgba(201,168,76,0.2)' : 'transparent',
              color: view === v ? '#c9a84c' : 'rgba(255,255,255,0.5)', position: 'relative' }}>
            {label}
            {v === 'feed' && newPostCount > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '8px', width: '16px', height: '16px',
                borderRadius: '50%', background: '#c9a84c', color: '#000', fontSize: '0.6rem',
                fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {newPostCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {view === 'feed' && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[['all','All'],['numbers','With Numbers'],['mine','Mine']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap', fontSize: '0.78rem', fontWeight: 600,
                background: filter === val ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.07)',
                color: filter === val ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❆</div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Tuning into the cosmos...</p>
        </div>
      ) : view === 'feed' ? (
        filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem',
            background: 'rgba(8,6,28,0.7)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No posts yet</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Share your cosmic moments on your Profile page</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(filtered as (FeedPost | SocialPost)[]).map((p, i) => (
              <PostCard key={p.id || i} post={p} onResonate={handleResonate} />
            ))}
          </div>
        )
      ) : (
        syncMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem',
            background: 'rgba(8,6,28,0.7)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No sync matches yet</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Log angel numbers to find cosmic connections</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {syncMatches.map((m, i) => (
              <div key={m.userId || i} style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '20px', padding: '1.25rem', backdropFilter: 'blur(16px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%',
                    background: m.avatarUrl ? 'transparent' : m.avatarColor,
                    border: '2px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', overflow: 'hidden', flexShrink: 0 }}>
                    {m.avatarUrl ? <img src={m.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '✨'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700 }}>{m.displayName}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                      {m.sharedNumbers.slice(0, 3).map(n => (
                        <span key={n} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '999px',
                          background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>{n}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c9a84c',
                      fontFamily: 'Cormorant Garamond, serif' }}>{m.syncScore}%</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>sync</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
