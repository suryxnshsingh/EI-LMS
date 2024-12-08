import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="chakra-petch-medium text-white bg-transparent backdrop-blur-lg m-4 w-[92%] md:w-[98%] fixed z-50 rounded-lg border-stone-700 border-2">
      <nav className="flex justify-between items-center px-3 py-4">
        <div className="flex-1">
          <h1 className="md:text-2xl text-nowrap text-xl px-3 font-bold">
            <a href="#home">EI Department - LMS</a>
          </h1>
        </div>

        <div className="flex-1 hidden md:flex justify-center">
          <ul className="flex space-x-8">
            <li className="md:text-lg font-medium">
              <a href="#about">About</a>
            </li>
            <li className="md:text-lg font-medium">
              <a href="#faculty">Faculty</a>
            </li>
            <li className="md:text-lg font-medium">
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            className="mx-2 py-1 px-4 bg-cyan-500 rounded-sm"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </div>
      </nav>
    </div>
  );
}
