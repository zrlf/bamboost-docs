import cn from "clsx";
import type { ReactElement, ReactNode } from "react";

const InformationCircleIcon = () => (
  <div className="mt-1 inline-block">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      width="20"
      height="20"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      />
    </svg>
  </div>
);

const TypeToEmoji = {
  default: "💡",
  error: "🚫",
  // info: <InformationCircleIcon className="_mt-1" />,
  info: <InformationCircleIcon />,
  warning: "⚠️",
};

type CalloutType = keyof typeof TypeToEmoji;

const classes: Record<CalloutType, string> = {
  default: cn(
    "_border-orange-100 _bg-orange-50 _text-orange-800 dark:_border-orange-400/30 dark:_bg-orange-400/20 dark:_text-orange-300",
  ),
  error: cn(
    "_border-red-200 _bg-red-100 _text-red-900 dark:_border-red-200/30 dark:_bg-red-900/30 dark:_text-red-200",
  ),
  info: cn(
    "_border-blue-200 _bg-blue-100 _text-blue-900 dark:_border-blue-200/30 dark:_bg-blue-900/30 dark:_text-blue-200",
  ),
  warning: cn(
    "_border-yellow-100 _bg-yellow-50 _text-yellow-900 dark:_border-yellow-200/30 dark:_bg-yellow-700/30 dark:_text-yellow-200",
  ),
};

type CalloutProps = {
  type?: CalloutType;
  emoji?: string | ReactNode;
  children: ReactNode;
  title?: string;
};

export function Callout({
  children,
  type = "default",
  emoji = TypeToEmoji[type],
  title,
}: CalloutProps): ReactElement {
  return (
    <div
      className={cn(
        "nextra-callout _overflow-x-auto mt-6 _flex _rounded-lg _border _py-2 ltr:_pr-4 rtl:_pl-4",
        "contrast-more:_border-current contrast-more:dark:_border-current",
        classes[type],
      )}
    >
      <div
        className="_select-none _text-xl ltr:_pl-3 ltr:_pr-2 rtl:_pr-3 rtl:_pl-2"
        style={{
          fontFamily:
            '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
      >
        {emoji}
      </div>
      {title ? (
        <div className="_w-full _min-w-0 leading-7 relative">
          <div className="_mb-2 _font-bold">{title}</div>
          <div className="h-[1px] bg-current opacity-35 absolute left-[-10rem] right-[-10rem]"></div>
          <div className="mt-3">{children}</div>
        </div>
      ) : (
        <div className="_w-full _min-w-0 _leading-7">{children}</div>
      )}
    </div>
  );
}
