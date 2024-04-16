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
        const res = await axios.get(
          "https://passgen-zqcd.onrender.com/savedpass",
          {
            params: { username: cookies.user },
          }
        );
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [cookies.user]);

  const handleDelete = async (id: any) => {
    try {
      await axios.delete("http://localhost:3500/deletepass", {
        params: { username: cookies.user, _id: id },
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

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
          <div className="flex flex-col gap-10 mt-20 p-10 h-[60%] overflow-auto border rounded-xl bg-white bg-opacity-20 backdrop-blur-md">
            <h1 className="text-2xl font-semibold">Saved Passwords</h1>
            <div>
              <table className="flex flex-col gap-4">
                <thead>
                  <tr className="flex gap-10 border rounded-lg p-2">
                    <th className="p-2">Sl. No.</th>
                    <th className="p-2">Website</th>
                    <th className="p-2">Password</th>
                    <th className="p-2">Utilities</th>
                  </tr>
                </thead>
                <tbody
                  className={`flex flex-col rounded-lg p-2 ${
                    data.length>0 ? "border" : ""
                  }`}
                >
                  {data.map((item, index) => (
                    <tr className="flex gap-10" key={index}>
                      <td className="border rounded-lg p-2">{index + 1}</td>
                      <td className="border rounded-lg p-2">{item.website}</td>
                      <td className="border rounded-lg p-2">{item.password}</td>
                      <td className="border rounded-lg p-2">
                        <button
                          onClick={() => {
                            handleDelete(item._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </Client>
    </HydrationProvider>
  );
};

export default page;
