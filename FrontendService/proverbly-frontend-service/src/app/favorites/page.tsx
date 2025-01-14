"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { Proverb } from "@/app/models/proverb";
import {
  getUserFavoriteProverbsApi,
  deleteUserFavoriteProverbApi,
} from "@/services/user/userApiService";
import { getProverbsByIdApi } from "@/services/proverb/proverbApiService";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Proverb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const userFavorites = (await getUserFavoriteProverbsApi(user._id))
          .favorites;

        console.log(userFavorites);

        const proverbs = await Promise.all(
          userFavorites.map((id: number) => getProverbsByIdApi(id))
        );

        setFavorites(proverbs);
      } catch (error) {
        console.error("즐겨찾기 목록을 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, router]);

  const handleDelete = async (proverbId: number) => {
    try {
      if (!user) return;

      await deleteUserFavoriteProverbApi(user._id, proverbId);

      // 삭제 후 목록에서 제거
      setFavorites((prev) =>
        prev.filter((proverb) => proverb.id !== proverbId)
      );
    } catch (error) {
      console.error("즐겨찾기 삭제 중 오류 발생:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">내 즐겨찾기</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">즐겨찾기한 속담이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((proverb) => (
            <div
              key={proverb.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow relative"
            >
              <button
                onClick={() => handleDelete(proverb.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="즐겨찾기 삭제"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="font-semibold mb-2">{proverb.text}</h2>
              <p className="text-gray-600 mb-2">{proverb.meaning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
