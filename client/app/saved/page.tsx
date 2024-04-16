"use client";
import React from "react";
import { HydrationProvider, Client } from "react-hydration-provider";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";

const page = () => {
  const [cookies, setCookies, removeCookies] = useCookies(["user", "token"]);
  const router = useRouter();

  interface DataItem {
    _id: string;
    website: string;
    password: string;
  }

  const [data, setData] = React.useState<DataItem[]>([]);

  const logout = (
    <button
      className="button flex"
      onClick={() => {
        removeCookies("user");
        router.push("/signin");
      }}
    >
      Logout
    </button>
  );

  React.useEffect(() => {
    //
    const fetchData = async () => {
      try {
        const res = await axios.get("https://passgen-zqcd.onrender.com/savepass", {
          params: { username: cookies.user },
        });
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [cookies.user]);

  return (
    <HydrationProvider>
      <Client>
        <main className="flex flex-col justify-center items-center h-screen w-screenselect-none">
          <nav className="absolute top-0 left-0 w-full">
            <div className="flex justify-around items-center gap-2 p-2 py-6 border-b">
              <h1 className="text-2xl font-bold">PassGen</h1>
              <div className="flex justify-center items-center gap-5">
                <a href="/savepass" className="button flex">
                  <h1>Save Passwords</h1>
                </a>
                {cookies.token ? logout : ""}
              </div>
            </div>
          </nav>
          <div className="flex flex-col gap-10 p-10 border rounded-xl bg-white bg-opacity-20 backdrop-blur-md">
            <h1 className="text-2xl font-semibold">Saved Passwords</h1>
            <div>
              {data.map((item, index) => (
                <div key={item._id}>
                  <p>
                    {index+1} | {item.website} | {item.password}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </Client>
    </HydrationProvider>
  );
};

export default page;
