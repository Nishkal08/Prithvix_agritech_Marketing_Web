export default function EmptyState({ icon: Icon, heading, body, cta, onCtaClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-16 h-16 rounded-full bg-[#EDE8DF] flex items-center justify-center mb-2">
        <Icon size={28} className="text-muted" />
      </div>
      <h3 className="font-display font-semibold text-xl text-dark">{heading}</h3>
      {body && <p className="text-secondary text-sm max-w-xs">{body}</p>}
      {cta && (
        <button
          onClick={onCtaClick}
          className="mt-4 bg-gold hover:bg-gold/90 text-dark font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
        >
          {cta}
        </button>
      )}
    </div>
  );
}
