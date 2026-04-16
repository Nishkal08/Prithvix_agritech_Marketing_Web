export default function SkeletonRow({ cols = 6 }) {
  return (
    <tr className="border-b border-[#E8E3DA]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-[14px]">
          <div
            className="h-4 rounded"
            style={{
              background: 'linear-gradient(90deg, #EDE8DF 25%, #F5F0E8 50%, #EDE8DF 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s linear infinite',
              width: i === 0 ? '70%' : '55%',
            }}
          />
        </td>
      ))}
    </tr>
  );
}
