"use client";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/features/authSlice";

export function Header() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-[#2a3033] hover:text-[#54E165] transition-colors"
          >
            Proverbly
          </Link>
          <nav className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600 font-bold">{user?.name}님</span>

                <Link
                  href="/favorites"
                  className="text-gray-600 hover:text-[#54E165] transition-colors"
                >
                  즐겨찾기
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-[#54E165] transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-[#54E165] transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-[#54E165] text-white hover:opacity-90 transition-opacity"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
