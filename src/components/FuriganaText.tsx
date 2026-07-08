import type { RubySegment } from "../types/sentence";

interface FuriganaTextProps {
  segments: RubySegment[];
  className?: string;
}

export function FuriganaText({ segments, className = "text-xl" }: FuriganaTextProps) {
  return (
    <p className={`furigana-text font-jp leading-relaxed text-inherit ${className}`}>
      {segments.map((segment, index) =>
        segment.reading ? (
          <ruby key={`${segment.text}-${index}`}>
            {segment.text}
            <rt>{segment.reading}</rt>
          </ruby>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        ),
      )}
    </p>
  );
}
