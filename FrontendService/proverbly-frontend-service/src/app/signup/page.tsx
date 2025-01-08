"use client";
import { useState } from "react";
import type { SignUpForm } from "../models/user";
import { createUserApi } from "../../services/user/userApiService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignUpForm>>({});
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<SignUpForm> = {};

    if (!form.name) {
      newErrors.name = "닉네임을 입력해주세요";
    }

    if (!form.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!form.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (form.password.length < 6) {
      newErrors.password = "비밀번호는 6글자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const callCreateUserApi = async () => {
    try {
      setIsLoading(true);
      await createUserApi(form);
      setIsLoading(false);
      router.push("/login");
    } catch (error) {
      console.error("Error creating user:", error);
      setSignUpError("회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await callCreateUserApi();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">회원가입</h2>
          <p className="mt-2 text-gray-600">
            Proverbly와 함께 영어 속담을 배워보세요
          </p>
          {signUpError && (
            <p className="mt-2 text-sm text-[#f44336]">{signUpError}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                닉네임
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#54E165] focus:outline-none"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-[#f44336]">{errors.name}</p>
              )}
            </div>

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

          {isLoading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              가입 중...
            </>
          ) : (
            <>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#54E165] hover:opacity-90 focus:outline-none"
              >
                가입하기
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
