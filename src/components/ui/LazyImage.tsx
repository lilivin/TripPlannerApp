import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  aspectRatio?: string;
  className?: string;
  containerClassName?: string;
  loadingClassName?: string;
}

export function LazyImage({
  src,
  alt,
  placeholderSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f1f5f9'/%3E%3C/svg%3E",
  aspectRatio = "16/9",
  className,
  containerClassName,
  loadingClassName,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, just show the image
    if (!window.IntersectionObserver) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Load images when they are 200px from viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle image load event
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={cn("relative overflow-hidden bg-slate-100 dark:bg-slate-800", containerClassName)}
      style={{ aspectRatio }}
      aria-busy={!isLoaded}
    >
      {/* Low quality placeholder */}
      <img
        src={placeholderSrc}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100 blur-sm"
        )}
      />

      {/* Main image - only load src when in viewport */}
      <img
        ref={imgRef}
        src={isInView ? src : placeholderSrc}
        alt={alt}
        onLoad={handleImageLoaded}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        loading="lazy"
        decoding="async"
        {...props}
      />

      {/* Loading indicator */}
      {!isLoaded && isInView && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80",
            loadingClassName
          )}
        >
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
