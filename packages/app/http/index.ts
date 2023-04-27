import { randomUUID } from "crypto";
import $http from "./axios";

export async function getUser() {
  const req = await $http.get("/");
  const data = req.data;
  return data;
}

export const verifyUser = async (data: any) => {
  try {
    const res = await $http.post(`/auth/verifyUser`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};

export const resendVerificationMail = async (email: string) => {
  try {
    const res = await $http.get(`/waitlist/resend-email/${email}`);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};

export const verifyUserEmail = async (code: string) => {
  try {
    const res = await $http.get(`/auth/verification/${code}`);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};

export const resendVerificationCode = async (email: string) => {
  try {
    const res = await $http.get(`/auth/resend/verification/${email}`);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};

export const loginUser = async (data: any) => {
  try {
    const res = await $http.post("/auth/login", data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};

export const createThread = async (data: any) => {
  try {
    const res = await $http.post("/thread/createThread", data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};

export const bookmarkThread = async (data: any) => {
  try {
    const res = await $http.post(`/bookmark/thread`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};

export const fetchAllBookmarks = async (type: string) => {
  try {
    const randNum = Math.floor(Math.random() * 10e10);
    const res = await $http.get(
      `/bookmark/allBookmarks?type=${type}&uuid=${randNum}`
    );
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    console.log(e);
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};

// notifier
export const createVariant = async (data: any) => {
  try {
    const res = await $http.post(`/notifier/createVariant`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};

export const allVariants = async () => {
  try {
    const res = await $http.get(`/notifier/allVariants`);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response?.data ?? { message: e.message, code: e?.code };
  }
};
