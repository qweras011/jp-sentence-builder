interface JapanesePieceProps {
  text: string;
  reading?: string;
  showFurigana: boolean;
  className?: string;
}

export function JapanesePiece({ text, reading, showFurigana, className = "" }: JapanesePieceProps) {
  if (showFurigana && reading) {
    return (
      <ruby className={`furigana-text font-jp ${className}`}>
        {text}
        <rt>{reading}</rt>
      </ruby>
    );
  }

  return <span className={`font-jp ${className}`}>{text}</span>;
}
