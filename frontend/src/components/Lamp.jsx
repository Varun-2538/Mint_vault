"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../utils";
import ScrollArrow from "./ScrollArrow";

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 py-4 text-center text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-white glow-effect"
      >
        Swap INR <br className="block" /> Stack Crypto
      </motion.h1>
    </LampContainer>
  );
}

export const LampContainer = ({
  children,
  className
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0",
        className
      )}>
      <div
        className="relative flex w-full flex-1 scale-y-100 sm:scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-40 sm:h-56 overflow-visible w-[20rem] sm:w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]">
          <div
            className="absolute w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div
            className="absolute w-40 h-[100%] left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-40 sm:h-56 w-[20rem] sm:w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]">
          <div
            className="absolute w-40 h-[100%] right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div
            className="absolute w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div
          className="absolute top-1/2 h-40 sm:h-48 w-full translate-y-12 scale-x-125 sm:scale-x-150 bg-slate-950 blur-2xl"></div>
        <div
          className="absolute top-1/2 z-50 h-40 sm:h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div
          className="absolute inset-auto z-50 h-24 sm:h-36 w-[20rem] sm:w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-24 sm:h-36 w-48 sm:w-64 -translate-y-[4rem] sm:-translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[20rem] sm:w-[30rem] -translate-y-[5rem] sm:-translate-y-[7rem] bg-cyan-400 "></motion.div>

        <div
          className="absolute inset-auto z-40 h-32 sm:h-44 w-full -translate-y-[10rem] sm:-translate-y-[12.5rem] bg-slate-950 "></div>
      </div>
      <div className="relative z-50 flex -translate-y-60 sm:-translate-y-80 flex-col items-center px-5">
        {children}
      </div>
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-50">
        <ScrollArrow />
      </div>
    </div>
  );
};