import { cn } from "../lib/utils";

const fontSizes = {
  small: '0.5rem',
  normal: '1rem',
  mid: '1.3rem',
  medium: '2.25rem',
  large: '2.75rem',
}

export interface CustomTextProps extends React.HTMLProps<HTMLDivElement> {
  weight?: 'bold' | 'light' | 'semibold' | 'normal';
  fontSize?: keyof typeof fontSizes;
}

export default function DefaultText(props: CustomTextProps) {
  const weight = props.weight || 'normal';
  const size = fontSizes[props.fontSize || 'normal'];
  return <div
    {...props}
    style={{fontSize: size,...props.style}}
    className={cn(`text-[var(--text-primary)] font-display font-${weight} text-[${size}] ` + props.className)}>
    {props.children}
  </div>;
}