import { InputHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export default function DefaultInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn('w-full p-4 rounded-lg bg-[var(--bg-tertiary)] font-display ' + props.className)}
      style={{
        color: 'var(--text-primary)',
        outline: 'none',
        border: 'none',
        ...props.style,
      }}
    />
  )
}