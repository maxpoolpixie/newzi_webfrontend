import { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";  // Import animation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import bgImage from "/OBJECT.png";
import tik from "/XMLID_00000013880963527179188930000007792323982135118746_.png"

function App() {
  const [email, setEmail] = useState("");
  const [visitorCount, setVisitorCount] = useState(0);
  const scrollRef = useRef(null);

  // Fetch visitor count with animation
  const animatedNumber = useSpring({
    from: { number: 0 },
    to: { number: visitorCount },
    delay: 500,
    config: { tension: 100, friction: 20 },
  });

  // Initialize Locomotive Scroll
  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.08,
    });

    return () => locomotiveScroll.destroy();
  }, []);

  // Fetch visitor count from backend
  useEffect(() => {
    fetch("https://newzi-backend-w9qj.vercel.app/track-visitor")
      .then((response) => response.json())
      .then((data) => setVisitorCount(data.totalVisitors))
      .catch((error) => {
        console.error("Error fetching visitor count:", error);
        toast.error("Failed to fetch visitor count");
      });
  }, []);

  // Handle email submission
  const handleSubscribe = async () => {
    if (email.trim() === "") {
      toast.warning("Please enter a valid email.");
      return;
    }
     if(!email.includes("@"){
       toast.warning("invalid email")
       return 
      }

    const scriptURL = "https://newzi-backend-w9qj.vercel.app/email";

    try {
     
      const response = await fetch(scriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.status === "success") {
        toast.success(`Thank you! We've added ${email} to the list.`);
        setEmail("");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("There was an error. Please try again later.");
    }
  };

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="relative flex flex-col items-center justify-center min-h-screen bg-white text-center"
    >
      {/* Floating Tik Image */}
      <img 
        src={tik} 
        className="w-[30px] md:w-[40px] lg:w-[50px] h-6 md:h-8 absolute top-[120px] md:top-[200px] right-[40px] md:right-[120px] floating" 
        alt="Tik Icon" 
      />

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Section */}
      <div className="pt-14 pb-28 w-[90%] md:w-[80%] lg:w-[70%]" data-scroll>
        <h1 className="text-[40px] md:text-[60px] lg:text-[80px] font-semibold text-gray-800" data-scroll-speed="1">
          Coming Soon
        </h1>
        <p className="text-gray-600 mt-3 mx-auto text-[16px] md:text-[20px] lg:text-[22px]" data-scroll-speed="2">
          Stay informed with <strong>Newzi</strong>, a modern AI-powered news platform that delivers accurate news tailored to your preferences. Get updates effortlessly and stay up to date with the latest stories.
        </p>

        <p className="mt-3 text-gray-700 font-medium text-[16px] md:text-[20px] lg:text-[22px]" data-scroll-speed="2">
          Be the first to try Newzi! Drop your email, and we’ll notify you when we launch. 🚀
        </p>

        {/* Animated Visitor Counter */}
        <div className="text-center mt-6" data-scroll>
          <p className="text-lg text-gray-600">Total Visitors</p>
          <animated.p
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#f04923] drop-shadow-lg glow"
            data-scroll-speed="1.5"
          >
            {animatedNumber.number.to((n) => Math.floor(n))}
          </animated.p>
        </div>

        {/* Email Input Section */}
        <div className="my-6 flex flex-col md:flex-row justify-center items-center gap-3" data-scroll>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[90%] md:w-72 rounded-md"
          />
          <button
            onClick={handleSubscribe}
            className="bg-[#f04923] text-white px-4 py-2 font-semibold hover:bg-red-600 hover:cursor-pointer rounded-md"
          >
            Notify me
          </button>
        </div>
      </div>

      {/* Background Image */}
      <div className="w-full relative" data-scroll>
        {/* Coming Soon Bubble */}
        <div className="absolute top-1 right-[27%] md:right-[29%] md:top-[0.1vw] lg:top-[0.3vw] 2xl:top-10 2xl:right-[33%] bg-transparent px-8 py-4 md:px-10 md:py-5 rounded-full transform rotate-[0deg]">
          <p className="text-[3vw]  md:text-[3vw] lg:text-[3vw] text-[#0c2933] font-bold italic">Coming</p>
          <p className="text-[3vw]  md:text-[3vw] lg:text-[3vw] text-[#6195C5] font-bold italic">Soon</p>
        </div>

        <img src={bgImage} alt="Illustration" className="w-full object-cover" data-scroll-speed="-2" />
      </div>
    </div>
  );
}

export default App;
