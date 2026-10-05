import { initialsOf } from "./useAccount";

export default function Avatar({ name, size = 36 }: { name?: string | null; size?: number }) {
  return (
    <span
      className="neo-avatar"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  );
}
