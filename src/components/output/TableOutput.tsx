interface TableOutputProps {
  headers: string[];
  rows: string[][];
}

/**
 * Renders a monospace-aligned table with a header row.
 *
 * Column widths are computed from the maximum content length in each column
 * so all rows align. Cells overflow horizontally on mobile rather than
 * stacking — this preserves the terminal aesthetic.
 */
export function TableOutput({ headers, rows }: TableOutputProps) {
  // Compute max width per column (content length only — no padding).
  const colWidths = headers.map((h, colIdx) => {
    const dataMax = rows.reduce(
      (max, row) => Math.max(max, (row[colIdx] ?? '').length),
      0,
    );
    return Math.max(h.length, dataMax);
  });

  /** Pads a string to a given width with spaces. */
  function pad(str: string, width: number) {
    return str + ' '.repeat(Math.max(0, width - str.length));
  }

  const separator = colWidths.map((w) => '─'.repeat(w + 2)).join('┼');

  return (
    <div className="overflow-x-auto">
      <table
        className="border-separate border-spacing-0 font-mono text-[length:var(--font-size-base)]"
        aria-label="Command output table"
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left pr-4 pb-1 text-[var(--accent)] font-normal whitespace-nowrap"
                style={{ minWidth: `${colWidths[i] + 2}ch` }}
              >
                {pad(h, colWidths[i])}
              </th>
            ))}
          </tr>
          <tr aria-hidden="true">
            <td colSpan={headers.length} className="pb-1">
              <span className="text-[var(--border)]">{separator}</span>
            </td>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {headers.map((_, colIdx) => (
                <td
                  key={colIdx}
                  className="pr-4 align-top text-[var(--fg)] whitespace-nowrap"
                >
                  {pad(row[colIdx] ?? '', colWidths[colIdx])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
