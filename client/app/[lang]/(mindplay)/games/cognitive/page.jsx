"use client";

import GameCard from "@/components/Games/GameCard";
import { cognitiveGames } from "@/constants/gamesData";

const EmotionalWellBeingPage = () => {
  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-scroll pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {cognitiveGames.map((game, index) => (
            <GameCard
              key={index}
              title={game.title}
              publisher={game.publisher}
              rating={game.rating}
              players={game.players}
              views={game.views}
              imageUrl={game.imageUrl}
              isHot={game.isHot}
              gameLink={game.gameLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalWellBeingPage;
