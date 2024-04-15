"use client";
import Image from "next/image";
import React from "react";
import { useCookies } from "react-cookie";
import { HydrationProvider, Client } from "react-hydration-provider";
import "./globals.css";
import ClipboardJS from "clipboard";

export default function Home() {
  const [pasLength, setPasLength] = React.useState(16);
  const [password, setPassword] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);

  const keys =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

  const generate = async () => {
    let password = "";
    for (let i = 0; i < pasLength; i++) {
      password += keys[Math.floor(Math.random() * keys.length)];
    }
    return password;
  };

  const copied = async () => {
    new ClipboardJS("#password", {
      text: function (trigger) {
        return (trigger as HTMLElement).innerText;
      },
    });
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const onClick = async () => {
    const generatedPassword = generate();
    setPassword(await generatedPassword);
  };

  const login = (
    <a href="/signin" className="button flex">
      Sign In
    </a>
  );

  const logout = (
    <button className="button flex" onClick={() => removeCookies("user")}>
      Logout
    </button>
  );

  new ClipboardJS("button");

  return (
    <HydrationProvider>
      <Client>
        <main className="select-none">
          <nav className="absolute top-0 left-0 w-full">
            <div className="flex justify-around items-center gap-2 p-2 py-6 border-b">
              <h1 className="text-2xl font-bold">PassGen</h1>
              <div className="flex justify-center items-center gap-5">
                {cookies.user ? (
                  <a href="/savepass" className="button flex">
                    <h1>Save Passwords</h1>
                  </a>
                ) : (
                  ""
                )}
                {cookies.user ? logout : login}
              </div>
            </div>
          </nav>
          <div className="flex flex-col justify-center items-center gap-4 min-h-screen w-screen">
            <div>
              <div className="flex gap-3 items-center p-2">
                <div className="flex justify-start items-center overflow-auto w-56 p-2 px-3 border border-white rounded-lg scroll">
                  <h1
                    id="password"
                    className="border-none outline-none text-gray-400 bg-transparent select-text"
                  >
                    {password ? password : "Password"}
                  </h1>
                </div>
                <button
                  className="p-2 border border-green-600 rounded-lg"
                  onClick={onClick}
                >
                  <Image src="/tick.svg" alt="copy" width={25} height={100} />
                </button>
                <button
                  data-clipboard-target="#password"
                  onClick={copied}
                  className="p-2 border border-green-600 rounded-lg"
                >
                  <Image src="/copy.svg" alt="copy" width={25} height={100} />
                </button>
                {isCopied && (
                  <div className="relative bg-green-500 text-white p-2 rounded">
                    Copied!
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 p-2">
                  <p>Password Length:</p>
                  <input
                    type="number"
                    min="16"
                    max="100"
                    value={pasLength}
                    onChange={(e) => setPasLength(parseInt(e.target.value))}
                    className="p-1 w-[25%] border rounded-lg bg-transparent"
                  />
                  <button
                    className="p-2 border border-green-600 rounded-lg"
                    onClick={() => window.location.reload()}
                  >
                    <Image
                      src="/reload.svg"
                      alt="copy"
                      width={25}
                      height={100}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Client>
    </HydrationProvider>
  );
}
