/** max-w-2xl 기준 대략 한 줄에 들어가는 조각 수 */
export const WORD_BANK_PIECES_PER_ROW = 5;

const ROW_HEIGHT_REM = 2.625;

export function getWordBankMinRows(pieceCount: number): number {
  return Math.max(1, Math.ceil(pieceCount / WORD_BANK_PIECES_PER_ROW));
}

export function getPieceAreaMinHeight(pieceCount: number): string {
  const rows = Math.max(2, getWordBankMinRows(pieceCount));
  return `calc(${rows} * ${ROW_HEIGHT_REM}rem + 0.25rem)`;
}

export function getWordBankBodyMinHeight(pieceCount: number): string {
  const rows = getWordBankMinRows(pieceCount);
  return `calc(${rows} * ${ROW_HEIGHT_REM}rem)`;
}
