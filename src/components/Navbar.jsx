import QuizLogo from "../assets/Quiz_Logo.png";
import StarBorder from "../stylings/StarBorder";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { logout } = useAuth();
  return (
    <div className="">
      <div className="p-5 z-50">
        <div className="flex justify-evenly items-center gap-5 md:gap-[5rem]">
          {/* Logo */}
          <img src={QuizLogo} alt="Quizlogo" className="Quizlogo h-13 w-auto" />

          {/* Play & Create Buttons */}
          <div className="font-Shantell text-2xl md:text-4xl text-white flex gap-6 z-50">
            <Link className="hover:underline" to="/create" >Create</Link>
          </div>

          {/* Logout */}
          <StarBorder
            as="button"
            className="custom-class"
            color="cyan"
            speed="2s"
            onClick={logout}
          >
            Logout
          </StarBorder>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
