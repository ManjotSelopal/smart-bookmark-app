"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]); // NEW

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchBookmarks(); // NEW
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) fetchBookmarks(); // NEW
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

useEffect(() => {
  if (!user) return;

  const channel = supabase
    .channel("bookmarks-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookmarks" },
      () => {
        fetchBookmarks();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);


  // NEW
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const deleteBookmark = async (id: string) => {
  await supabase.from("bookmarks").delete().eq("id", id);
  fetchBookmarks();
};

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const addBookmark = async () => {
    if (!title || !url || !user) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");

    fetchBookmarks(); // NEW
  };

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      {!user ? (
        <button
          onClick={loginWithGoogle}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <p>Logged in as {user.email}</p>

          {/* Add bookmark form */}
          <div className="flex gap-2">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2"
            />
            <input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border p-2"
            />
            <button
              onClick={addBookmark}
              className="bg-blue-500 text-white px-4"
            >
              Add
            </button>
          </div>

          {/* Bookmark list */}
          <div className="mt-4 w-full max-w-md">
  {bookmarks.map((b) => (
    <div
      key={b.id}
      className="flex justify-between border p-2 mb-2"
    >
      <div>
        <p className="font-bold">{b.title}</p>
        <a
          href={b.url}
          target="_blank"
          className="text-blue-500 text-sm"
        >
          {b.url}
        </a>
      </div>


<button
  onClick={() => {
    if (confirm("Delete this bookmark?")) {
      deleteBookmark(b.id);
    }
  }}
  className="text-red-500"
>
  Delete
</button>




    </div>
  ))}
</div>


          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}








// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
