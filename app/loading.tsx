import type { Metadata } from "next";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        </div>
        <p className="text-lg font-medium text-foreground mb-2">Loading...</p>
        <p className="text-sm text-muted-foreground">Please wait while we prepare your content</p>
      </motion.div>
    </div>
  );
}

// Named exports for compatibility
export function LoadingState() {
  return <Loading />;
}