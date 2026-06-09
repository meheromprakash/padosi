import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

const CATEGORIES = [
  { value: 'general', label: 'General', icon: 'forum', color: 'text-primary' },
  { value: 'help', label: 'Help', icon: 'campaign', color: 'text-tertiary' },
  { value: 'event', label: 'Event', icon: 'event', color: 'text-secondary' },
  { value: 'alert', label: 'Alert', icon: 'warning', color: 'text-error' },
  { value: 'recommendation', label: 'Recommend', icon: 'recommend', color: 'text-primary' },
];

export default function PostComposer({ onSubmit, onClose, placeholder = "What's happening in your colony?" }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 4 - images.length);
    setImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append('content', content.trim());
    formData.append('category', category);
    images.forEach((img) => formData.append('media', img));

    const result = await onSubmit?.(formData);
    if (result?.success !== false) {
      setContent('');
      setImages([]);
      setPreviews([]);
      onClose?.();
    }
    setSubmitting(false);
  };

  const initials = (user?.firstName || 'U').charAt(0).toUpperCase();

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-stack-lg shadow-[0px_4px_12px_rgba(31,41,55,0.05)] border border-outline-variant/10">
      {/* Category Selection Bar */}
      <div className="flex gap-2 mb-4 hide-scrollbar overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              category === cat.value
                ? 'bg-primary text-white'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-stack-md mb-stack-md">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-primary font-bold">
          {user?.avatar ? (
            <img alt="User" className="w-full h-full object-cover" src={user.avatar} />
          ) : (
            initials
          )}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-surface-container border-none rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-primary-container transition-all resize-none font-body-md text-body-md placeholder:text-outline text-on-surface"
          placeholder={placeholder}
          maxLength={500}
        />
      </div>

      {/* Image previews */}
      {previews.length > 0 && (
        <div className={`grid gap-2 mb-4 rounded-xl overflow-hidden ${previews.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {previews.map((src, idx) => (
            <div key={idx} className="relative group aspect-video">
              <img src={src} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-stack-sm border-t border-outline-variant/20">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileRef}
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={images.length >= 4}
            className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-colors flex items-center gap-2 font-semibold text-xs disabled:opacity-40"
          >
            <span className="material-symbols-outlined">image</span>
            <span className="font-label-sm text-label-sm">Photo</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-outline">{content.length}/500</span>
          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && images.length === 0) || submitting}
            className="bg-primary text-on-primary font-bold px-6 py-2 rounded-xl text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>{submitting ? 'Posting...' : 'Post'}</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
