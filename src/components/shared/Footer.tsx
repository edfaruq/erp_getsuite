export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-1 px-8 lg:px-10 py-4 text-sm text-muted-foreground text-center">
        <p>
          © {year} <span className="font-medium text-foreground/80">UNDIP GetSuite</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
