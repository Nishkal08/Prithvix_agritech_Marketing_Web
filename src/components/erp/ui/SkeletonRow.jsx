export default function SkeletonRow({ cols = 6 }) {
  return (
    <tr className="border-b border-border/40">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-[14px]">
          <div
            className="h-4 rounded bg-surface animate-pulse"
            style={{ width: i === 0 ? '70%' : '55%' }}
          />
        </td>
      ))}
    </tr>
  );
}
