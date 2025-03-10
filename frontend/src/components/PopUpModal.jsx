"use client";
import React, { useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "./AnimatedModal";
import { Link } from "react-router-dom";

export function PopUpModal({ isTriggered }) {
  const { setOpen } = useModal();

  useEffect(() => {
    if (isTriggered) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  });

  return (
    <div className="flex items-center justify-center">
      <ModalBody>
        <ModalContent>
          <h4 className="text-lg md:text-2xl dark:text-neutral-100 font-bold text-center mb-8">
            Just a few more steps to go! 
          </h4>
          <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto text-black">
            <div>
              <span>Kindly add the following details -</span>
            </div>
            <div className="flex items-center justify-center">
              <ElevatorIcon className="mr-1 text-black dark:text-neutral-300 h-4 w-4" />
              <span className="text-black dark:text-neutral-300 text-sm">
                Consumer Number
              </span>
            </div>
            <div className="flex items-center justify-center">
              <VacationIcon className="mr-1 text-black dark:text-neutral-300 h-4 w-4" />
              <span className="text-black dark:text-neutral-300 text-sm">
                Meter Number
              </span>
            </div>
          </div>
        </ModalContent>
        <ModalFooter className="gap-4">
          <a
            href="/settings/edit"
            className="bg-blue-600 text-white dark:bg-white dark:text-blue-600 text-base px-6 py-2 rounded-md border border-blue-600"
          >
            Complete Now
          </a>
        </ModalFooter>
      </ModalBody>
    </div>
  );
}
const VacationIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
      />
    </svg>
  );
};

const ElevatorIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
      <path d="M10 10l2 -2l2 2" />
      <path d="M10 14l2 2l2 -2" />
    </svg>
  );
};
