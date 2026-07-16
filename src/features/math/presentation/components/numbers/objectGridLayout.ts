/** Responsive grid sizing so objects never overlap on any screen. */
export function objectGridLayout(count: number): {
  columns: number;
  itemSize: number;
  gap: number;
  fontSize: number;
} {
  if (count <= 4) {
    return {columns: 2, itemSize: 88, gap: 16, fontSize: 48};
  }
  if (count <= 9) {
    return {columns: 3, itemSize: 80, gap: 14, fontSize: 44};
  }
  if (count <= 16) {
    return {columns: 4, itemSize: 68, gap: 12, fontSize: 38};
  }
  if (count <= 25) {
    return {columns: 5, itemSize: 58, gap: 10, fontSize: 32};
  }
  if (count <= 40) {
    return {columns: 6, itemSize: 50, gap: 8, fontSize: 28};
  }
  return {columns: 8, itemSize: 42, gap: 6, fontSize: 24};
}
