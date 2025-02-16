"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { updateFavoriteGames, getUserDetails } from "@/lib/actions/user.action";
import GameCard from "@/components/Games/GameCard";
import {
  cognitiveGames,
  motorGames,
  emotionalGames,
  socialGames,
} from "@/constants/gamesData";

const GamesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [availableGames, setAvailableGames] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const games = cognitiveGames.concat(motorGames, emotionalGames, socialGames);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userId = user.publicMetadata?.userId;
        try {
          const existingUser = await getUserDetails(userId);
          if (existingUser) {
            const favoriteGames = existingUser.faovriteGames;
            const updatedGames = games.map((game) => {
              const favoriteGame = favoriteGames.find(
                (favGame) => favGame.name === game.title
              );
              return { ...game, favorite: !!favoriteGame?.value };
            });
            setAvailableGames(updatedGames);
            setFavorites(updatedGames.filter((game) => game.favorite));
          } else {
            setAvailableGames(
              games.map((game) => ({ ...game, favorite: false }))
            );
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const toggleFavorite = async (title) => {
    if (!user) return;
    const userId = user.id;
    try {
      await updateFavoriteGames(
        userId,
        title,
        !availableGames.find((game) => game.title === title).favorite
      );
      setAvailableGames((prevGames) =>
        prevGames.map((game) =>
          game.title === title ? { ...game, favorite: !game.favorite } : game
        )
      );
      setFavorites((prevFavorites) => {
        if (prevFavorites.some((game) => game.title === title)) {
          return prevFavorites.filter((game) => game.title !== title);
        } else {
          return [
            ...prevFavorites,
            availableGames.find((game) => game.title === title),
          ];
        }
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const filteredGames =
    activeTab === "all"
      ? availableGames.filter((game) => !game.favorite)
      : availableGames.filter((game) => {
          const gameType = game.type || "other";
          return gameType === activeTab && !game.favorite;
        });

  return (
    <div className="h-full overflow-hidden bg-gray-50">
      <div className="h-full overflow-y-scroll max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Games Collection
          </h1>
          <p className="text-gray-600">
            Discover and manage your favourite games
          </p>
        </div>

        {/* Favorites Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Favorite Games
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {favorites.length} Games
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.length === 0 ? (
              <div className="col-span-full">
                <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">
                    No favourite games yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Start adding games to your favourites!
                  </p>
                </div>
              </div>
            ) : (
              favorites.map((game, index) => (
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
                  favorite={game.favorite}
                  onFavoriteClick={toggleFavorite}
                />
              ))
            )}
          </div>
        </section>

        {/* Discover Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Discover More Games
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Games
              </button>
              <button
                onClick={() => setActiveTab("cognitive")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "cognitive"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Cognitive
              </button>
              <button
                onClick={() => setActiveTab("motor")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "motor"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Motor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, index) => (
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
                favorite={game.favorite}
                onFavoriteClick={toggleFavorite}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GamesPage;
