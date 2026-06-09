import { useState } from 'react';
import { formatDistanceToNow } from '../utils/dateUtils';

const CATEGORY_LABELS = {
  general: 'General',
  help: 'Help Wanted',
  recommendation: 'Recommendation',
  event: 'Event',
  listing: 'For Sale',
  alert: 'Alert',
};

export default function FeedCard({ post, onReact, onComment, onDelete }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.reactions?.like || 0);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikeCount((prev) => liked ? prev - 1 : prev + 1);
    onReact?.(post._id, 'like');
  };

  const isAlert = post.category === 'alert';
  const authorName = post.author?.firstName || 'Neighbor';
  const colonyName = post.locality?.name || 'Greenwood Estates';
  const timeAgo = formatDistanceToNow(post.createdAt);
  const initials = authorName.charAt(0).toUpperCase();

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
              <div className="absolute right-0 top-8 bg-white border border-outline-variant/30 rounded-xl shadow-lg py-1 min-w-[130px] z-10">
                <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low">Report</button>
                {onDelete && (
                  <button 
                    onClick={() => { onDelete(post._id); setShowMenu(false); }} 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-on-error-container font-body-md mb-stack-md leading-relaxed">
          {post.content}
        </p>

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

        <div className="flex gap-stack-sm pt-2">
          <button 
            onClick={handleLike} 
            className={`font-bold px-4 py-2 rounded-xl text-label-md flex items-center gap-2 transition-all ${liked ? 'bg-error text-white' : 'bg-white/20 text-on-error-container hover:bg-white/30'}`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>recommend</span>
            {liked ? 'Safe' : 'Mark Safe'} ({likeCount})
          </button>
          <button 
            onClick={onComment}
            className="border border-error/30 text-on-error-container font-bold px-4 py-2 rounded-xl text-label-md hover:bg-white/10"
          >
            Replies ({post.commentsCount || 0})
          </button>
        </div>
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
                <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low">Report</button>
                {onDelete && (
                  <button 
                    onClick={() => { onDelete(post._id); setShowMenu(false); }} 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-on-surface-variant font-body-md mb-stack-md leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

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

      <div className="flex items-center gap-stack-lg pt-stack-sm border-t border-outline-variant/10">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors ${liked ? 'text-primary font-bold' : ''}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>recommend</span>
          <span className="font-label-md text-label-md">{likeCount}</span>
        </button>
        <button 
          onClick={onComment} 
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="font-label-md text-label-md">{post.commentsCount || 0} Replies</span>
        </button>
      </div>
    </div>
  );
}
