import { AuthStatus } from "@/components/auth/auth-status";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AuthStatus />
      <ModeToggle />

      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h1 className="text-4xl md:text-7xl mb-4 font-bold">
            Pejuangkorea Academy
          </h1>
          <h2 className="text-3xl md:text-6xl mb-8">
            페장코리아 아카데미
          </h2>
          <p className="text-xl text-muted">
            Your journey to Korean language mastery begins here
          </p>
        </div>
      </header>

      {/* Brand Showcase */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl mb-12 text-primary font-bold">Brand Colors</h2>

          {/* Color Palette */}
          <div>
            <h3 className="text-xl mb-6 text-secondary font-semibold">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="h-24 bg-primary rounded-lg mb-2"></div>
                <p className="text-sm">Primary</p>
              </div>
              <div>
                <div className="h-24 bg-secondary rounded-lg mb-2"></div>
                <p className="text-sm">Secondary</p>
              </div>
              <div>
                <div className="h-24 bg-accent rounded-lg mb-2"></div>
                <p className="text-sm">Accent</p>
              </div>
              <div>
                <div className="h-24 bg-muted rounded-lg mb-2"></div>
                <p className="text-sm">Muted</p>
              </div>
              <div>
                <div className="h-24 bg-background rounded-lg border mb-2"></div>
                <p className="text-sm">Background</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Showcase */}
      <section className="bg-muted py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl mb-12 text-primary font-bold">Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg">
              <h3 className="text-xl mb-4 text-secondary font-semibold">Geometric Pattern</h3>
              <div className="border border-accent rounded-lg p-4">
                <div className="w-full h-48 bg-primary/10 rounded"></div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg">
              <h3 className="text-xl mb-4 text-secondary font-semibold">Korean Flag</h3>
              <div className="border border-accent rounded-lg p-4">
                <div className="w-full h-48 bg-primary/10 rounded flex items-center justify-center">
                  <div className="w-32 h-32 relative">
                    <div className="absolute inset-0 border-2 border-secondary rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
