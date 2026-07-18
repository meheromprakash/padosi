import { useState, useEffect } from 'react';
import { formatDistanceToNow } from '../utils/dateUtils';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../hooks/useComments';
import api from '../api/axios';

const CATEGORY_LABELS = {
  general: 'General',
  help: 'Help Wanted',
  recommendation: 'Recommendation',
  event: 'Event',
  listing: 'For Sale',
  alert: 'Alert',
};

export default function FeedCard({ post, onReact, onBookmark, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount || 0);

  // Keep local comments count in sync with post prop updates
  useEffect(() => {
    setLocalCommentsCount(post.commentsCount || 0);
  }, [post.commentsCount]);

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    const res = await onUpdate?.(post._id, { content: editContent.trim() });
    if (res?.success !== false) {
      setIsEditing(false);
    }
  };

  const isAlert = post.category === 'alert';
  const authorName = post.author?.firstName || 'Neighbor';
  const colonyName = post.locality?.name || 'Greenwood Estates';
  const timeAgo = formatDistanceToNow(post.createdAt);
  const initials = authorName.charAt(0).toUpperCase();

  const isAuthor = user && (post.authorId === user._id || post.author?._id === user._id);

  if (isAlert) {
    return (
      <div className="bg-error-container border border-error/20 rounded-2xl p-stack-lg shadow-[0px_8px_24px_rgba(186,26,26,0.08)] transition-all relative">
        <div className="flex justify-between items-start mb-stack-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error rounded-full flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-error-container font-bold">Priority Alert</h3>
              <p className="font-label-sm text-label-sm text-on-error-container/70">{colonyName} • {timeAgo}</p>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="text-on-error-container hover:bg-error/10 p-2 rounded-full flex items-center justify-center"
            >
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-outline-variant/30 rounded-xl shadow-lg py-1 min-w-[130px] z-10 text-on-surface">
                {isAuthor && (
                  <>
                    <button 
                      onClick={() => { setIsEditing(true); setEditContent(post.content); setShowMenu(false); }} 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => { onDelete?.(post._id); setShowMenu(false); }} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Delete
                    </button>
                  </>
                )}
                {!isAuthor && (
                  <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low">Report</button>
                )}
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mb-stack-md flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white/20 border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-error text-on-error-container resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-on-error-container"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate} 
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-white hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-on-error-container font-body-md mb-stack-md leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        )}

        {/* Media if exists */}
        {post.media?.length > 0 && (
          <div className={`grid gap-2 mb-4 rounded-xl overflow-hidden ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media.map((imgUrl, idx) => (
              <div key={idx} className="relative aspect-video">
                <img src={imgUrl} alt="Alert media" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-stack-sm pt-2">
          {/* Mark Safe (Like) */}
          <button 
            onClick={() => onReact?.(post._id, 'like')} 
            className={`font-bold px-4 py-2 rounded-xl text-label-md flex items-center gap-2 transition-all ${post.userReaction === 'like' ? 'bg-error text-white' : 'bg-white/20 text-on-error-container hover:bg-white/30'}`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: post.userReaction === 'like' ? "'FILL' 1" : "'FILL' 0" }}>recommend</span>
            {post.userReaction === 'like' ? 'Safe' : 'Mark Safe'} ({post.reactions?.like || 0})
          </button>
          
          {/* Replies */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className="border border-error/30 text-on-error-container font-bold px-4 py-2 rounded-xl text-label-md hover:bg-white/10"
          >
            Replies ({localCommentsCount})
          </button>

          {/* Bookmark */}
          <button 
            onClick={(e) => { e.stopPropagation(); onBookmark?.(post._id, !!post.userBookmarked); }} 
            className={`ml-auto p-2 rounded-xl flex items-center justify-center text-on-error-container hover:bg-white/10 ${post.userBookmarked ? 'bg-white/20' : ''}`}
            title={post.userBookmarked ? "Remove Bookmark" : "Bookmark Post"}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: post.userBookmarked ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
          </button>
        </div>

        {/* Collapsible comments section */}
        {showComments && (
          <CommentsSection 
            postId={post._id} 
            onCommentAdded={() => setLocalCommentsCount(c => c + 1)}
            onCommentDeleted={() => setLocalCommentsCount(c => c - 1)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-stack-lg shadow-[0px_4px_12px_rgba(31,41,55,0.05)] hover:shadow-[0px_8px_24px_rgba(31,41,55,0.08)] transition-all relative border border-outline-variant/10">
      <div className="flex justify-between items-start mb-stack-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center text-primary font-bold shrink-0">
            {post.author?.avatar ? (
              <img alt={authorName} className="w-full h-full object-cover" src={post.author.avatar} />
            ) : (
              initials
            )}
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
              {authorName}
              {post.author?.verification?.verified && (
                <span className="inline-flex items-center text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-full font-bold">
                  Verified
                </span>
              )}
            </h4>
            <p className="font-label-sm text-label-sm text-outline">{colonyName} • {timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.category && (
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="text-outline hover:text-on-surface p-1 rounded-full flex items-center justify-center"
            >
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-outline-variant/30 rounded-xl shadow-lg py-1 min-w-[130px] z-10">
                {isAuthor && (
                  <>
                    <button 
                      onClick={() => { setIsEditing(true); setEditContent(post.content); setShowMenu(false); }} 
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => { onDelete?.(post._id); setShowMenu(false); }} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Delete
                    </button>
                  </>
                )}
                {!isAuthor && (
                  <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low">Report</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="mb-stack-md flex flex-col gap-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary text-on-surface resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => setIsEditing(false)} 
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container hover:bg-surface-container-high text-on-surface"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate} 
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-on-primary hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-on-surface-variant font-body-md mb-stack-md leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Post media */}
      {post.media?.length > 0 && (
        <div className={`grid gap-2 mb-stack-md rounded-xl overflow-hidden ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.media.map((imgUrl, idx) => (
            <div key={idx} className="relative aspect-video">
              <img src={imgUrl} alt="Post attachment" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-stack-sm border-t border-outline-variant/10">
        {/* Like */}
        <button 
          onClick={() => onReact?.(post._id, 'like')} 
          className={`flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors ${post.userReaction === 'like' ? 'text-primary font-bold' : ''}`}
          title="Like"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: post.userReaction === 'like' ? "'FILL' 1" : "'FILL' 0" }}>recommend</span>
          <span className="font-label-md text-label-md">{post.reactions?.like || 0}</span>
        </button>

        {/* Heart */}
        <button 
          onClick={() => onReact?.(post._id, 'heart')} 
          className={`flex items-center gap-1.5 text-on-surface-variant hover:text-red-500 transition-colors ${post.userReaction === 'heart' ? 'text-red-500 font-bold' : ''}`}
          title="Love"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: post.userReaction === 'heart' ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          <span className="font-label-md text-label-md">{post.reactions?.heart || 0}</span>
        </button>

        {/* Support */}
        <button 
          onClick={() => onReact?.(post._id, 'support')} 
          className={`flex items-center gap-1.5 text-on-surface-variant hover:text-secondary transition-colors ${post.userReaction === 'support' ? 'text-secondary font-bold' : ''}`}
          title="Support"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: post.userReaction === 'support' ? "'FILL' 1" : "'FILL' 0" }}>volunteer_activism</span>
          <span className="font-label-md text-label-md">{post.reactions?.support || 0}</span>
        </button>

        {/* Replies */}
        <button 
          onClick={() => setShowComments(!showComments)} 
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
          <span className="font-label-md text-label-md">{localCommentsCount} Replies</span>
        </button>

        {/* Bookmark */}
        <button 
          onClick={(e) => { e.stopPropagation(); onBookmark?.(post._id, !!post.userBookmarked); }} 
          className={`ml-auto p-1.5 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors ${post.userBookmarked ? 'text-primary' : ''}`}
          title={post.userBookmarked ? "Remove Bookmark" : "Bookmark Post"}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: post.userBookmarked ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
        </button>
      </div>

      {/* Collapsible comments section */}
      {showComments && (
        <CommentsSection 
          postId={post._id} 
          onCommentAdded={() => setLocalCommentsCount(c => c + 1)}
          onCommentDeleted={() => setLocalCommentsCount(c => c - 1)}
        />
      )}
    </div>
  );
}

function CommentsSection({ postId, onCommentAdded, onCommentDeleted }) {
  const { comments, loading, addComment, deleteComment } = useComments(postId);
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    const res = await addComment(newComment);
    setSubmitting(false);
    if (res.success) {
      setNewComment('');
      onCommentAdded?.();
    }
  };

  const handleDelete = async (commentId) => {
    const res = await deleteComment(commentId);
    if (res.success) {
      onCommentDeleted?.();
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/10 flex flex-col gap-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs shrink-0 overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="Me" className="w-full h-full object-cover" />
          ) : (
            (user?.firstName || 'U').charAt(0).toUpperCase()
          )}
        </div>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Reply to this post..."
          className="flex-1 bg-[#F3F5F4] border-none rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary text-on-surface"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="bg-primary text-on-primary rounded-xl px-4 py-2 text-xs font-bold disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all text-white"
        >
          {submitting ? 'Replying...' : 'Reply'}
        </button>
      </form>

      {/* Loading state */}
      {loading && comments.length === 0 && (
        <div className="text-center text-xs text-outline py-2">Loading replies...</div>
      )}

      {/* Empty state */}
      {!loading && comments.length === 0 && (
        <div className="text-center text-xs text-outline py-2">No replies yet. Be the first to reply!</div>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => {
            const authorName = comment.author?.firstName || 'Neighbor';
            const initials = authorName.charAt(0).toUpperCase();
            const isCommentOwner = user && (comment.authorId === user._id || comment.author?._id === user._id);
            return (
              <div key={comment._id} className="flex gap-3 items-start bg-[#F3F5F4]/40 p-3 rounded-xl border border-outline-variant/5">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-xs shrink-0 overflow-hidden">
                  {comment.author?.avatar ? (
                    <img src={comment.author.avatar} alt={authorName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                      {authorName}
                      {comment.author?.verification?.verified && (
                        <span className="material-symbols-outlined text-secondary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      )}
                    </p>
                    <span className="text-[10px] text-outline">{formatDistanceToNow(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
                {isCommentOwner && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-outline hover:text-red-600 transition-colors p-1 rounded-full flex items-center justify-center"
                    title="Delete reply"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
