import { cn } from "@/lib/utils";

export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col items-center mx-4 sm:mx-0", className)}
      {...props}
    />
  );
}
