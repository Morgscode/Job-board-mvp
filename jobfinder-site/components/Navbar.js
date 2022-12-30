import React, { useState, useEffect, useRef } from 'react';
import useNavState from '../utils/useNavState';

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Navbar() {
  const mobileNav = useRef(null);
  const accountNav = useRef(null);

  const [mobileNavActive, setMobileNavActive ] = useNavState(mobileNav);
  const [accountMenuActive, setAccountMenuActive ] = useNavState(accountNav);

  const loggedInLinks = (
    <React.Fragment>
      <li>
        <a
          href="/my-account"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          My Account
        </a>
      </li>
    </React.Fragment>
  );

  const loggedOutLinks = (
    <React.Fragment>
      <li>
        <a
          href="/register"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Register
        </a>
      </li>
      <li>
        <a
          href="/login"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Login
        </a>
      </li>
    </React.Fragment>
  );

  const signOutLinks = (
    <React.Fragment>
    <div className="py-1">
      <a
        href="/logout"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
      >
        Sign out
      </a>
    </div>
  </React.Fragment>
  );

  const links = (
    <>{loggedOutLinks}</>
  );

  return (
    <nav className="p-2 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <a href="#" className="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-6 mr-3 sm:h-10"
            alt="Flowbite Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Open Job Board
          </span>
        </a>
        <button
          onClick={(e) => setMobileNavActive(!mobileNavActive)}
          data-collapse-toggle="navbar-multi-level"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-multi-level"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          ref={mobileNav}
          className="hidden w-full md:block md:w-auto"
          id="navbar-multi-level"
        >
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <button
                onClick={() => setAccountMenuActive(!accountMenuActive)}
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                className="flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-white dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Account{' '}
                <svg
                  className="w-4 h-4 ml-1"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div
                ref={accountNav}
                id="dropdownNavbar"
                className="z-10 hidden relative md:absolute w-full md:w-auto font-normal bg-white divide-y divide-gray-100 md:rounded md:shadow md:w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul
                  className="py-1 text-sm text-gray-700 w-full md:w-auto dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  {links}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
