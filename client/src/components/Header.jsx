import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";
import { IconButton, MobileNav } from "@material-tailwind/react";
import { FaHome, FaPen } from "react-icons/fa";
import axios from "axios";

function Header() {
  const isLogin = useSelector((state) => state.isLogin);
  const dispatch = useDispatch();
  const location = useLocation(); // Add this line
  const [blogs, setBlogs] = useState([]);
  const [openNav, setOpenNav] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `${window.location.origin}/api/v1/blog/all-blogs`
        );
        if (data?.success) {
          setBlogs(data.blogs);
        } else {
          toast.error("An error occurred while fetching blogs");
        }
      } catch (error) {
        toast.error("An error occurred while fetching blogs");
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const getUserDetail = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8080/api/v1/user/current-user/${userId}`
          );
          if (data?.success) {
            setUser(data.userProfile);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      getUserDetail();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpenNav(false); // Add this line to close nav on route change
  }, [location]);

  const handleLogout = () => {
    try {
      dispatch(authActions.logout());
      toast.success("Logout successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navList = (
    <ul className="flex flex-col  md:flex-row justify-center items-center gap-x-4">
      {isLogin ? (
        <>
          <div className="flex flex-col md:flex-row justify-center items-center gap-x-4 md:mr-24">
            <NavLink to="/" key="home">
              <li className="transition-all hover:text-blue-600 cursor-pointer flex justify-center items-center gap-x-1 rounded-sm border-2 border-orange-900 px-2 py-1">
                Home <FaHome />
              </li>
            </NavLink>
            <NavLink to="/all-blogs" key="all-blogs">
              <li className="transition-all hover:text-blue-600 cursor-pointer flex justify-center items-center gap-x-1">
                Latest Articles
                <span className="bg-green-400 text-black w-5 h-5 rounded-full flex justify-center items-center hover:scale-105 transition-colors mb-2">
                  {blogs.length}
                </span>
              </li>
            </NavLink>
            <NavLink to="/user-blogs" key="user-blogs">
              <li className="transition-all hover:text-blue-600 cursor-pointer flex justify-center items-center gap-x-1">
                My Blogs
                <span className="bg-green-400 text-black w-5 h-5 rounded-full flex justify-center items-center hover:scale-105 transition-colors mb-2">
                  {user.blogs?.length}
                </span>
              </li>
            </NavLink>
            <NavLink to="/create-blog" key="create-blog">
              <li className="hover:text-blue-600 cursor-pointer flex justify-center items-center gap-x-1">
                Write <FaPen />
              </li>
            </NavLink>
            <NavLink to="/all-users" key="all-users">
              <li className="hover:text-gray-400 cursor-pointer flex justify-center items-center gap-x-1">
                Authors
              </li>
            </NavLink>
          </div>
          <NavLink to="/login" key="logout" onClick={handleLogout}>
            <li className="transition-all hover:scale-110 font-bold mt-12 md:mt-0">
              Logout
            </li>
          </NavLink>
          <NavLink
            to={`/current-user/${localStorage.getItem("userId")}`}
            key="user-profile"
          >
            <li className="hover:text-gray-300 cursor-pointer text-black p-2 rounded-full transition-all hover:scale-105">
              <img
                src={user.image || "https://via.placeholder.com/150"}
                alt={user.username || "User"}
                className="w-8 h-8 rounded-full"
              />
            </li>
          </NavLink>
        </>
      ) : (
        <div className="flex flex-col md:flex-row justify-center items-center gap-y-3 gap-x-2">
          <NavLink to="/login" key="login">
            <li className="px-3 py-1 border border-yellow-500 transition-all hover:scale-105">
              Login
            </li>
          </NavLink>
          <NavLink to="/register" key="register">
            <li className="bg-yellow-500 px-3 py-1 text-black rounded-sm border border-yellow-500 transition-all hover:scale-105">
              Get Started Free
            </li>
          </NavLink>
        </div>
      )}
    </ul>
  );

  return (
    <div className="z-30 w-full flex flex-wrap sm:justify-between items-center backdrop-blur-md backdrop-contrast-100 fixed text-black text-sm font-semibold px-4 py-5 md:gap-y-0 gap-x-4">
      <h2 className="font-bold bg-gradient-to-r from-gray-700 via-blue-700 to-orange-500 bg-clip-text text-transparent text-base md:text-lg cursor-pointer">
        <NavLink to="/">
          blogBea
          <span className="bg-green-300 rounded-full text-orange-900 p-1">
            con
          </span>
        </NavLink>
      </h2>
      <nav className="hidden md:block">{navList}</nav>
      <IconButton
        variant="text"
        className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
        ripple={false}
        onClick={() => setOpenNav(!openNav)}
      >
        {openNav ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </IconButton>
      <MobileNav open={openNav}>
        <div className="h-[21rem] flex justify-center items-center">
          {navList}
        </div>
      </MobileNav>
    </div>
  );
}

export default Header;
