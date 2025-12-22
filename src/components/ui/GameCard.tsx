import Link from "next/link";
import { GeoGame } from "@/data/games";
import { Clock, Zap } from "lucide-react";

interface GameCardProps {
  game: GeoGame;
  featured?: boolean;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

const categoryColors = {
  quiz: "bg-blue-100 text-blue-700",
  puzzle: "bg-purple-100 text-purple-700",
  memory: "bg-pink-100 text-pink-700",
  exploration: "bg-teal-100 text-teal-700",
};

export default function GameCard({ game, featured = false }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`block bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group ${
        featured ? "ring-2 ring-primary/20" : ""
      }`}
    >
      <div className="p-6">
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {game.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
              {game.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {game.shortDescription}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              categoryColors[game.category]
            }`}
          >
            {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              difficultyColors[game.difficulty]
            }`}
          >
            {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{game.playTime}</span>
          </div>
          <div className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
            <Zap className="h-4 w-4" />
            <span>Play Now</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
