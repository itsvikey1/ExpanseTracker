import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function DarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("darkMode"));
    if (saved !== null) {
      setDark(saved);
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)} className="dark-mode-btn">
      {dark ? <FaSun /> : <FaMoon />}
      {dark ? " Light Mode" : " Dark Mode"}
    </button>
  );
}