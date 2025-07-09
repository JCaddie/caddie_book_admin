import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-600 focus:ring-primary-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 border border-gray-300",
    outline:
      "bg-white text-primary border border-primary hover:bg-primary-50 focus:ring-primary-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm gap-1 rounded-md",
    md: "h-10 px-4 text-base gap-1 rounded-md", // Figma 40px 높이, 4px gap
    lg: "h-12 px-6 text-lg gap-2 rounded-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6", // Figma 24px 아이콘
    lg: "w-6 h-6",
  };

  const isLoading = loading || disabled;

  return (
    <button
      className={[baseStyles, variants[variant], sizes[size], className]
        .filter(Boolean)
        .join(" ")}
      disabled={isLoading}
      {...props}
    >
      {loading && (
        <div
          className={[
            "animate-spin rounded-full border-2 border-transparent border-t-current",
            iconSizes[size],
          ].join(" ")}
        />
      )}
      {icon && !loading && <span className={iconSizes[size]}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
