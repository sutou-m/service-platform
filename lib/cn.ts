/**
 * Merges Tailwind class strings, filtering out falsy values.
 * Sufficient for MVP; swap for clsx + tailwind-merge if class
 * override conflicts arise in complex components.
 */
export function cn(
  ...inputs: (string | undefined | null | false | 0)[]
): string {
  return inputs.filter(Boolean).join(" ");
}
