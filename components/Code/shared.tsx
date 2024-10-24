import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Components } from "hast-util-to-jsx-runtime";
import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export const components = (
  inline: boolean,
  noBackground: boolean = false,
  className?: string,
): Partial<Components> => {
  if (inline) {
    return {
      pre: ({ ref: _ref, className: _className, style: _style, ...props }) => {
        const style: CSSProperties = {
          ..._style,
          backgroundColor: undefined,
        };
        return (
          <code
            className={cn(
              _className,
              className,
              noBackground &&
                "!bg-transparent [&_span]:!bg-transparent !border-none",
            )}
            style={style}
            {...props}
          />
        );
      },
      code: (props) => <span {...props} />,
    };
  } else {
    return {
      pre: ({ ref: _ref, className: _className, style: _style, ...props }) => {
        return (
          <CodeBlock
            className={cn(_className, className)}
            {...props}
          >
            <Pre>{props.children}</Pre>
          </CodeBlock>
        );
      },
    };
  }
};

