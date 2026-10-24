interface ProfileBannerProps {
  coverUrl?: string;
}

export default function ProfileBanner({ coverUrl }: ProfileBannerProps) {
  return (
    <div className="relative h-36 w-full overflow-hidden border-b border-zinc-800/80 bg-[#050505] sm:h-48">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          {/* Crimson gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-[#1a0505] to-[#050505]" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(239,68,68,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.15) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </>
      )}

      {/* Bottom gradient fade for smooth transition to avatar */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  );
}