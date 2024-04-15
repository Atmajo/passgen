"use client";
import React from "react";
import { HydrationProvider, Client } from "react-hydration-provider";
import { useCookies } from "react-cookie";
import axios from "axios";

const page = async () => {
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);

  const logout = (
    <button className="button flex" onClick={() => removeCookies("user")}>
      Logout
    </button>
  );

  const [form, setForm] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    axios.post("http://localhost:3500/signup", form).then((res) => {
      console.log(res.data);
    });
  };

  return (
    cookies.user && (
      <HydrationProvider>
        <Client>
          <main>
            <nav className="absolute top-0 left-0 w-full">
              <div className="flex justify-around items-center gap-2 p-2 py-6 border-b">
                <h1 className="text-2xl font-bold">PassGen</h1>
                <div className="flex justify-center items-center gap-5">
                  {cookies.user ? (
                    <a href="/saved" className="button flex">
                      <h1>Saved Passwords</h1>
                    </a>
                  ) : (
                    ""
                  )}
                  {cookies.user ? logout : ""}
                </div>
              </div>
            </nav>
            <div className="flex flex-col gap-10 p-10 border rounded-xl bg-white bg-opacity-20 backdrop-blur-md">
              <h1 className="text-2xl font-semibold">Signup</h1>
              <form action="" method="post" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p>Username:</p>
                  <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    className="border rounded-lg p-1 bg-white bg-opacity-20 backdrop-blur-md text-black"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p>Email:</p>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    className="border rounded-lg p-1 bg-white bg-opacity-20 backdrop-blur-md text-black"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p>Password:</p>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    className="border rounded-lg p-1 bg-white bg-opacity-20 backdrop-blur-md text-black"
                  />
                </div>
                <button type="submit" className="button" onClick={handleSubmit}>
                  <h1>Save</h1>
                </button>
              </form>
            </div>
          </main>
        </Client>
      </HydrationProvider>
    )
  );
};

export default page;
