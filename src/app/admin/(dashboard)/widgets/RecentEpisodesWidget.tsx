import Link from "next/link";
import { getEpisodes } from "@/lib/episodes";

export default function RecentEpisodesWidget() {
  const episodes = getEpisodes().slice(0, 5);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl text-ink">Recent episodes</h2>
        <Link href="/admin/episodes" className="font-sans text-sm font-bold text-teal hover:underline">
          View all &rarr;
        </Link>
      </div>

      {episodes.length === 0 ? (
        <p className="font-sans text-sm text-ink/50">No episodes yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {episodes.map((ep) => (
            <li key={ep.id} className="flex items-center gap-3">
              {ep.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ep.image}
                  alt=""
                  className="h-10 w-16 shrink-0 rounded-md border border-ink/10 object-cover"
                />
              ) : (
                <div className="h-10 w-16 shrink-0 rounded-md border border-dashed border-ink/15 bg-cream" />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-sm font-semibold text-ink">{ep.title}</div>
                <div className="font-sans text-xs text-ink/50">
                  {ep.number} &middot; {ep.duration}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
