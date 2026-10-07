import Link from "next/link";
import { TrendingUp } from "lucide-react";

export interface TrendingTag {
  id: string;
  tag: string; // e.g. "worklife" or "#worklife"
  description: string;
  count: number | string; // e.g. 2400 or "2.4k"
}

interface TrendingFrustrationsProps {
  tags?: TrendingTag[];
  className?: string;
}

const DEFAULT_TRENDING_TAGS: TrendingTag[] = [
  {
    id: "1",
    tag: "worklife",
    description: "Corporate burnout & managers",
    count: "2.4k",
  },
  {
    id: "2",
    tag: "mondayrage",
    description: "Weekly start blues",
    count: "1.8k",
  },
  {
    id: "3",
    tag: "traffic",
    description: "Commute nightmares",
    count: "950",
  },
  {
    id: "4",
    tag: "badcode",
    description: "Legacy codebase fury",
    count: "840",
  },
];

export function TrendingFrustrations({
  tags = DEFAULT_TRENDING_TAGS,
  className = "",
}: TrendingFrustrationsProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-lg backdrop-blur-sm ${className}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-red-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Trending Frustrations
          </h3>
        </div>
        <span className="text-[10px] text-zinc-500 font-medium">Live</span>
      </div>

      {/* Tags List */}
      <div className="flex flex-col divide-y divide-zinc-800/50 text-xs">
        {tags.map((item) => {
          // "#" symbol URL ma pass huna nadeko
          const cleanTag = item.tag.replace(/^#/, "");
          const formattedCount =
            typeof item.count === "number"
              ? item.count >= 1000
                ? `${(item.count / 1000).toFixed(1)}k`
                : item.count
              : item.count;

          return (
            <Link
              key={item.id}
              href={`/explore?tag=${encodeURIComponent(cleanTag)}`}
              className="group flex items-center justify-between py-2.5 transition"
            >
              <div className="min-w-0 pr-2">
                <p className="truncate font-semibold text-zinc-200 transition group-hover:text-red-400">
                  #{cleanTag}
                </p>
                <p className="truncate text-[10px] text-zinc-500">
                  {item.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 text-[10px] font-medium text-zinc-400 group-hover:border-red-900/40 group-hover:text-zinc-300">
                {formattedCount} vents
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
