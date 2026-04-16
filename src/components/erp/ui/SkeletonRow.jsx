export default function SkeletonRow({ cols = 6 }) {
  return (
    <tr className="border-b border-subtle">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div
            className={`h-4 rounded-lg bg-tertiary animate-pulse transition-colors duration-500`}
            style={{
              width: i === 0 ? '80%' : i === cols - 1 ? '40%' : '60%',
            }}
          />
        </td>
      ))}
    </tr>
  );
}
