
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/95 group-[.toaster]:text-foreground group-[.toaster]:border-primary/20 group-[.toaster]:shadow-lg group-[.toaster]:shadow-primary/5 group-[.toaster]:rounded-lg group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:shadow-sm",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          title: "group-[.toast]:font-medium",
          success: "group-[.toast]:border-green-500/30 group-[.toast]:bg-green-500/10",
          error: "group-[.toast]:border-destructive/30 group-[.toast]:bg-destructive/10",
          info: "group-[.toast]:border-primary/30 group-[.toast]:bg-primary/10",
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

export { Toaster }
