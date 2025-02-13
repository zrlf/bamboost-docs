import { cn } from "@/fumapy/lib/utils";
import { AlertTriangle, CircleX, Info, Lightbulb } from "lucide-react";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type CalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "type" | "icon"
> & {
  title?: ReactNode;
  /**
   * @defaultValue info
   */
  type?: "info" | "warn" | "error" | "tip" | "note";

  /**
   * Force an icon
   */
  icon?: ReactNode;
};

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = "info", icon, ...props }, ref) => {
    const leftBorderColor = false;

    return (
      <div
        ref={ref}
        className={cn(
          "my-6 flex flex-row gap-2 rounded-lg bg-fd-card p-3 text-sm text-fd-card-foreground shadow-md",
          leftBorderColor
            ? {
                info: "border-l-blue-500/50 border-l-4!",
                tip: "border-l-green-500/50 border-l-4!",
                warn: "border-l-orange-500/50 border-l-4!",
                error: "border-l-red-500/50 border-l-4!",
                note: "border-l-blue-500/50 border-l-4!",
              }[type]
            : "border",
          className,
        )}
        {...props}
      >
        {icon ??
          {
            info: <Info className="size-5 fill-blue-500 text-fd-card" />,
            tip: <Lightbulb className="size-5 text-green-500" />,
            warn: (
              <AlertTriangle className="size-5 fill-orange-500 text-fd-card" />
            ),
            error: <CircleX className="size-5 fill-red-500 text-fd-card" />,
            note: <Info className="size-5 fill-blue-500 text-fd-card" />,
          }[type]}
        <div className="min-w-0 flex-1">
          {title ? <p className="not-prose mb-2 font-medium">{title}</p> : null}
          <div className="text-fd-muted-foreground prose-no-margin">
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Callout.displayName = "Callout";
