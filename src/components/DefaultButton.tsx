import { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";
import '../styles/DefaultButton.css';

export default function DefaultButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn('default-button ' + props.className)}
      style={{
        ...props.style,
      }}
    />
  )
}