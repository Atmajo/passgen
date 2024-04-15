"use client";
import React from "react";
import axios from "axios";
import "../globals.css";

const page = () => {
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
    axios.post("https://passgen-server.vercel.app/signup", form).then((res) => {
      console.log(res.data);
    });
  };
  
  return (
    <main className="flex flex-col justify-center items-center h-screen w-screenselect-none">
      <nav className="absolute top-0 left-0 w-full">
        <div className="flex justify-around items-center gap-2 p-2 py-6 border-b">
          <h1 className="text-2xl font-bold">PassGen</h1>
          <a href="/signin" className="button">
            <h1>Sign In</h1>
          </a>
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
            <h1>Sign Up</h1>
          </button>
        </form>
      </div>
    </main>
  );
};

export default page;
