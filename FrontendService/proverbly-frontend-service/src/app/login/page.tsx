"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginForm } from "../models/user";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/features/authSlice";
import { getUserByEmailAndPasswordApi } from "../../services/user/userApiService";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<LoginForm> = {};

    if (!form.email) {
      newErrors.email = "이메일을 입력해주세요";
    }

    if (!form.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const callLoginApi = async () => {
    try {
      const user = await getUserByEmailAndPasswordApi(
        form.email,
        form.password
      );
      dispatch(login(user));
      router.push("/");
    } catch (e) {
      if (e instanceof Error) {
        setLoginError("로그인 실패 : " + e.message);
      } else {
        setLoginError("로그인 실패");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await callLoginApi();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">로그인</h2>
          <p className="mt-2 text-gray-600">Proverbly에 오신 것을 환영합니다</p>
          {loginError && (
            <p className="mt-2 text-sm text-[#f44336]">{loginError}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#54E165] focus:outline-none"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-[#f44336]">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#54E165] focus:outline-none"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-[#f44336]">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#54E165] hover:opacity-90 focus:outline-none"
          >
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}
