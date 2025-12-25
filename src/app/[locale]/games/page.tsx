import { Metadata } from "next";
import GameCard from "@/components/ui/GameCard";
import { getAllGames, getGamesByCategory } from "@/data/games";
import { Gamepad2, Brain, Puzzle, Map, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Geography Games | Learn World Geography | TravelAgencies.World",
  description:
    "Play free geography games! Test your knowledge of world capitals, flags, countries, and landmarks. Fun educational games for all ages.",
  keywords: [
    "geography games",
    "world capitals quiz",
    "flag quiz",
    "country quiz",
    "map games",
    "educational games",
    "learn geography",
  ],
};

export default function GamesPage() {
  const allGames = getAllGames();
  const quizGames = getGamesByCategory("quiz");
  const puzzleGames = getGamesByCategory("puzzle");
  const memoryGames = getGamesByCategory("memory");
  const explorationGames = getGamesByCategory("exploration");

  const categories = [
    {
      name: "Quiz Games",
      icon: Brain,
      games: quizGames,
      description: "Test your geography knowledge",
    },
    {
      name: "Puzzle Games",
      icon: Puzzle,
      games: puzzleGames,
      description: "Piece together the world",
    },
    {
      name: "Memory Games",
      icon: Gamepad2,
      games: memoryGames,
      description: "Train your memory with geography",
    },
    {
      name: "Exploration",
      icon: Compass,
      games: explorationGames,
      description: "Discover the world",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Gamepad2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                {allGames.length} Free Games
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Geography Games
            </h1>
            <p className="text-xl text-white/80">
              Learn about the world while having fun! Play our collection of
              free geography games and test your knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{allGames.length}</div>
              <div className="text-muted-foreground">Games</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">195</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Free</div>
              <div className="text-muted-foreground">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Games by Category */}
      <div className="container mx-auto px-4 py-12">
        {categories.map((category) => (
          <section key={category.name} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <category.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {category.name}
                </h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* SEO Content */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-bold text-center mb-8">
              Learn Geography Through Games
            </h2>
            <p className="text-muted-foreground text-center">
              Our collection of geography games makes learning about the world
              fun and interactive. Whether you want to master world capitals,
              identify country flags, or test your knowledge of famous
              landmarks, we have a game for you. All games are free to play and
              work on any device.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
