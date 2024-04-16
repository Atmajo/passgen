"use client";
import React from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const page = () => {

  const [cookies, setCookies, removeCookies] = useCookies(["user", "token"]);

  const [form, setForm] = React.useState({
    website: "",
    password: "",
  });
  
  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
      username: cookies.user,
    }));
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      await axios.post(
        "https://passgen-zqcd.onrender.com/savepass",
        form
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screenselect-none">
      <nav className="absolute top-0 left-0 w-full">
        <div className="flex justify-around items-center gap-2 p-2 py-6 border-b">
          <h1 className="text-2xl font-bold">PassGen</h1>
          <div className="flex justify-center items-center gap-5">
            <a href="/saved" className="button flex">
              <h1>Saved Passwords</h1>
            </a>
          </div>
        </div>
      </nav>
      <div className="flex flex-col gap-10 p-10 border rounded-xl bg-white bg-opacity-20 backdrop-blur-md">
        <h1 className="text-2xl font-semibold">Save Passwords</h1>
        <form action="" method="post" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p>Website:</p>
            <input
              type="text"
              name="website"
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
  );
};

export default page;
