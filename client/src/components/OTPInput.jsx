import { useRef, useEffect, KeyboardEvent } from 'react';

export default function OTPInput({ length = 6, value, onChange, disabled = false }) {
  const inputs = useRef([]);

  const vals = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = (idx, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const newVals = [...vals];
    newVals[idx] = char;
    onChange(newVals.join(''));
    if (char && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !vals[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, '').slice(0, length));
    const focusIdx = Math.min(pasted.length, length - 1);
    inputs.current[focusIdx]?.focus();
  };

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  return (
    <div className="flex items-center gap-2 md:gap-3 justify-center" role="group" aria-label="OTP input">
      {vals.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`OTP digit ${idx + 1}`}
          className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold font-mono border-2 rounded-2xl transition-all duration-200 outline-none
            ${digit 
              ? 'border-primary-container bg-[#e8f5ee] text-primary-container font-extrabold' 
              : 'border-outline-variant/60 bg-surface-container-low text-on-surface'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-container/10
          `}
        />
      ))}
    </div>
  );
}
