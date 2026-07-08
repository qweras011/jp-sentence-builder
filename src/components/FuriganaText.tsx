import type { RubySegment } from "../types/sentence";

interface FuriganaTextProps {
  segments: RubySegment[];
  className?: string;
  showFurigana?: boolean;
}

export function FuriganaText({
  segments,
  className = "text-xl",
  showFurigana = true,
}: FuriganaTextProps) {
  return (
    <p className={`furigana-text font-jp leading-relaxed text-inherit ${className}`}>
      {segments.map((segment, index) =>
        segment.reading && showFurigana ? (
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
