"use client";
import { useEffect, useState } from "react";
import { Proverb } from "./models/proverb";
import React from "react";
import { getProverbApi } from "../services/proverb/proverbApiService";
import {
  addUserFavoriteProverbApi,
  deleteUserFavoriteProverbApi,
  getUserFavoriteProverbsApi,
} from "@/services/user/userApiService";
import { useAppSelector } from "./store/hooks";

export default function Home() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [currentProverb, setCurrentProverb] = useState<Proverb | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const fetchProverb = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const proverb = await getProverbApi();
      setCurrentProverb(proverb);

      if (isAuthenticated && user) {
        const response = await getUserFavoriteProverbsApi(user._id);
        const favoriteProverbs = response.favorites;
        setIsFavorite(favoriteProverbs.includes(proverb.id));
      }
    } catch (err) {
      setError("속담을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProverb();
  }, []);

  const handleNextProverb = async () => {
    setShowMeaning(false);
    await fetchProverb();
  };

  const handleFavorite = () => {
    console.log(user);
    if (!isAuthenticated || !user || !currentProverb) {
      return;
    }

    if (isFavorite) {
      deleteUserFavoriteProverbApi(user._id, currentProverb.id);
      setIsFavorite(false);
    } else {
      addUserFavoriteProverbApi(user._id, currentProverb.id);
      setIsFavorite(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-600">속담 불러오는 중...</p>
      </div>
    );
  }

  if (error || !currentProverb) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-xl text-[#f44336]">{error}</div>
        <button
          onClick={fetchProverb}
          className="mt-4 px-6 py-2 bg-[#f44336] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-16 text-center">
        <div className="flex flex-col items-center justify-center">
          {/* 속어 속담 */}
          <h1
            className={`text-3xl font-bold ${
              isFavorite ? "text-green-500" : "text-gray-800"
            }`}
          >
            {`"${currentProverb.text}"`}
          </h1>

          {/* 예문 */}
          <div className="mt-12 p-4 bg-white rounded-lg shadow-sm border-t border-gray-100">
            {currentProverb.examples.map((example, index) => (
              <p key={index} className="text-gray-700 font-medium">
                {example}
              </p>
            ))}
          </div>
        </div>

        {/* 한국어 해석 */}
        <p
          className={`text-xl text-gray-600 ${
            !showMeaning ? "blur-sm" : ""
          } hover:blur-none`}
        >
          {currentProverb.meaning}
        </p>

        {/* 버튼 그룹 */}
        <div className="flex flex-col space-y-4 max-w-xs mx-auto">
          <button
            onClick={() => setShowMeaning(!showMeaning)}
            className="px-6 py-2 bg-[#2a3033] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {showMeaning ? "해석 숨기기" : "해석 보기"}
          </button>

          <button
            onClick={handleFavorite}
            className="px-6 py-2 bg-[#FF6B6B] text-white rounded-lg hover:opacity-90 transition-opacity"
            disabled={!isAuthenticated || !user || !currentProverb}
          >
            {isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
          </button>

          <button
            onClick={handleNextProverb}
            className="px-6 py-2 bg-[#54E165] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            다음 속담
          </button>
        </div>
      </div>
    </main>
  );
}
