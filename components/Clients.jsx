"use client";

import Link from "next/link";
import { useState, createContext, useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const Context = createContext({ user: {} });

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      });
  }, []);

  return (
    <Context.Provider value={{ user, setUser }}>
      {children}
      <Toaster />
    </Context.Provider>
  );
};

export const LogoutBtn = () => {
  const { user, setUser } = useContext(Context);
  const logoutHandler = async () => {
    try {
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
      }
      setUser({});
      toast.success(data.message);
    } catch (error) {
      toast.error(data.message);
    }
  };
  return user?._id ? (
    <button onClick={logoutHandler} className="btn">
      Logout
    </button>
  ) : (
    <Link href={"/login"}>Login</Link>
  );
};

export const TodoButton = ({ id, completed }) => {
  const router = useRouter();

  const deleteHandler = async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) return toast.error(data.error);
      toast.success(data.message);
      router.refresh();
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const onChangeHandler = async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
      });
      const data = await res.json();

      if (!data.success) return toast.error(data.error);
      toast.success(data.message);
      router.refresh();
    } catch (error) {
      return toast.error(error.message);
    }
  };
  return (
    <>
      <input type="checkbox" checked={completed} onChange={onChangeHandler} />
      <button className="btn" onClick={deleteHandler}>
        Delete
      </button>
    </>
  );
};
