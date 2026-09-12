import { cn, getInitials, hexToRgba } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  bgColor?: string | null;
}

const sizeClasses = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export function Avatar({ name, src, className, size = "md", bgColor }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full text-navy-700 font-semibold flex items-center justify-center",
        !bgColor && "bg-mint-100",
        sizeClasses[size],
        className
      )}
      style={bgColor ? { backgroundColor: hexToRgba(bgColor, 0.55) } : undefined}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
