export default function ExerciseTable({ exercises, onChange, removable = false, onRemove }) {
  function update(i, field, val) {
    const next = exercises.map((ex, idx) =>
      idx === i ? { ...ex, [field]: val } : ex
    )
    onChange(next)
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase tracking-wide border-b border-zinc-800">
            <th className="text-left pb-2 font-medium">Exercise</th>
            <th className="text-center pb-2 font-medium w-14">Sets</th>
            <th className="text-center pb-2 font-medium w-20">Reps</th>
            <th className="text-center pb-2 font-medium w-16">kg</th>
            {removable && <th className="w-6" />}
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr key={i} className="border-b border-zinc-800/50">
              <td className="py-2 pr-2">
                {removable ? (
                  <input
                    type="text"
                    value={ex.name}
                    placeholder="Exercise name"
                    onChange={(e) => update(i, 'name', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                  />
                ) : (
                  <span className="text-zinc-200 text-xs leading-tight">{ex.name}</span>
                )}
              </td>
              <td className="py-2 px-1">
                <input
                  type="number"
                  value={ex.sets}
                  onChange={(e) => update(i, 'sets', e.target.value)}
                  className="w-full text-center bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </td>
              <td className="py-2 px-1">
                <input
                  type="text"
                  value={ex.reps}
                  onChange={(e) => update(i, 'reps', e.target.value)}
                  className="w-full text-center bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </td>
              <td className="py-2 pl-1">
                <input
                  type="number"
                  value={ex.weight}
                  onChange={(e) => update(i, 'weight', e.target.value)}
                  className="w-full text-center bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </td>
              {removable && (
                <td className="py-2 pl-2">
                  <button
                    onClick={() => onRemove(i)}
                    className="text-zinc-600 hover:text-rose-400 transition-colors text-base leading-none"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
