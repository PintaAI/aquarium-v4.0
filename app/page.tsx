import Image from "next/image";
import { AuthStatus } from "@/components/auth/auth-status";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8 sm:p-12">
      <AuthStatus />

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-6xl font-[family-name:var(--font-geist-sans)] font-bold mb-6">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Aquarium
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          A modern Next.js template for building beautiful web applications
        </p>
      </header>

      {/* Features Grid */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all"
          >
            <div className="mb-4 text-primary">{feature.icon}</div>
            <h2 className="font-[family-name:var(--font-geist-sans)] text-xl font-semibold mb-2">
              {feature.title}
            </h2>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        ))}
      </main>

      {/* CTA Section */}
      <footer className="max-w-xl mx-auto text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://github.com/yourusername/aquarium"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Star on GitHub
          </a>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-accent/50 transition-colors"
          >
            <span className="font-[family-name:var(--font-geist-mono)]">
              Read the docs →
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Next.js 15",
    description: "Built with the latest Next.js features including App Router and Server Components",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "TypeScript",
    description: "Full type safety and autocompletion with TypeScript configuration",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Tailwind CSS",
    description: "Utility-first CSS framework for rapid UI development",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
  },
];
