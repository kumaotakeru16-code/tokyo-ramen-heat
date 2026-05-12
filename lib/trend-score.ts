export function calcTrendScore(reviewsDelta: number, ratingDelta: number): number {
  return reviewsDelta * 0.7 + ratingDelta * 100 * 0.3
}

export function normalizeTrendScores(scores: number[]): number[] {
  const max = Math.max(...scores)
  const min = Math.min(...scores)
  if (max === min) return scores.map(() => 50)
  return scores.map(s => Math.round(((s - min) / (max - min)) * 100))
}
