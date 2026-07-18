import Link from "next/link";
import EpisodeCountWidget from "./widgets/EpisodeCountWidget";
import LatestEpisodeWidget from "./widgets/LatestEpisodeWidget";
import MissingLinksWidget from "./widgets/MissingLinksWidget";
import RecentEpisodesWidget from "./widgets/RecentEpisodesWidget";

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="eyebrow mb-2">Overview</div>
        <h1 className="font-serif text-3xl text-ink">Welcome back</h1>
        <p className="mt-1 font-sans text-sm text-ink/55">
          Here&apos;s what&apos;s happening with the podcast.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <EpisodeCountWidget />
        <LatestEpisodeWidget />
        <MissingLinksWidget />
        {/* Add more widgets here as new modules are built (e.g. guest count, newsletter signups). */}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentEpisodesWidget />
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="mb-4 font-serif text-xl text-ink">Quick actions</h2>
          <div className="flex flex-col gap-2">
            <Link
              href="/crossroads-admin/episodes"
              className="rounded-lg bg-teal px-4 py-2.5 text-center font-sans text-sm font-bold text-cream transition-opacity hover:opacity-90"
            >
              + Add episode
            </Link>
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-ink/15 px-4 py-2.5 text-center font-sans text-sm font-bold text-ink/70 hover:bg-cream"
            >
              View public site &#8599;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
