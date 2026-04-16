import { useCountUp } from "@/hooks/use-count-up";

interface RadialScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function RadialScore({ score, size = 160, strokeWidth = 10 }: RadialScoreProps) {
  const animatedScore = useCountUp(score, 1200);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / 100, 1);
  const offset = circumference * (1 - progress);

  const scoreColor =
    score >= 80
      ? "oklch(0.68 0.17 50)"
      : score >= 60
        ? "oklch(0.75 0.16 55)"
        : score >= 40
          ? "oklch(0.82 0.14 65)"
          : "oklch(0.55 0.02 260)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.92 0.005 80)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
        {/* Glow filter */}
        <defs>
          <filter id="scoreGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth / 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#scoreGlow)"
          opacity={0.4}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-extrabold text-foreground leading-none" style={{ fontSize: size * 0.3 }}>
          {animatedScore}
        </span>
        <span className="text-xs font-medium text-muted-foreground mt-1">Founder Score</span>
      </div>
    </div>
  );
}
