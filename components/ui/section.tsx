import type { ReactNode } from "react"

interface SectionProps {
  id?: string
  title?: string
  description?: string
  children: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  contentClassName?: string
  centered?: boolean
}

export function Section({
  id,
  title,
  description,
  children,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  contentClassName = "",
  centered = false,
}: SectionProps) {
  return (
    <section id={id} className={`w-full py-12 md:py-24 ${className}`}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        {(title || description) && (
          <div className={`flex flex-col ${centered ? "items-center text-center" : ""} space-y-4 mb-8`}>
            {title && <h2 className={`text-3xl font-bold tracking-tighter sm:text-4xl ${titleClassName}`}>{title}</h2>}
            {description && (
              <p className={`max-w-[900px] text-muted-foreground md:text-xl/relaxed ${descriptionClassName}`}>
                {description}
              </p>
            )}
          </div>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  )
}
