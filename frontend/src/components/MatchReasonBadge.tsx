export const MatchReasonBadge = ({ score, reason }: { score: number; reason: string }) => (
  <div className="rounded-md border border-reef/20 bg-reef/10 px-3 py-2 text-sm text-reef">
    <span className="font-semibold">{score}% match</span>
    <span className="mx-2 text-reef/50">|</span>
    {reason}
  </div>
);
