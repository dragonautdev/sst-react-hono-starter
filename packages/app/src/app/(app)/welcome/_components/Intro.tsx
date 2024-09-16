import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Intro() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const onLoad = () => {
    setLoading(false);
  };

  return (
    <motion.div
      className="z-10"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <div
        className={`${
          loading ? "scale-[25%] blur-md" : "scale-100 blur-0"
        }  h-[20vh] w-screen object-cover transition-all duration-1000`}
      ></div>
      
        <motion.div
          variants={{
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto"
        >
          <motion.h1 className="font-display text-4xl font-bold text-gray-800 transition-colors sm:text-5xl">
            Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
          </motion.h1>
          <motion.p className="max-w-md text-gray-600 transition-colors sm:text-lg">
            {process.env.NEXT_PUBLIC_APP_NAME} helps you to track your resources across the supply chain.
          </motion.p>
          <motion.button
            className="rounded-full bg-gray-800 px-10 py-2 font-medium text-white transition-colors hover:bg-black"
            onClick={() => router.push("/welcome?step=workspace")}
          >
            Get Started
          </motion.button>
        </motion.div>
     
    </motion.div>
  );
}
