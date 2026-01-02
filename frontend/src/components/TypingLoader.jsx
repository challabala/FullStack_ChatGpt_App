export default function TypingLoader() {
  return (
    <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
      <div className="h-2 w-2 rounded-full animate-bounce bg-muted-foreground" />
      <div className="h-2 w-2 rounded-full animate-bounce bg-muted-foreground delay-150" />
      <div className="h-2 w-2 rounded-full animate-bounce bg-muted-foreground delay-300" />
    </div>
  );
}
