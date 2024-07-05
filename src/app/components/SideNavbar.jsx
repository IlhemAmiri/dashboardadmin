"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Disclosure } from '@headlessui/react';
import { MdOutlineSpaceDashboard, MdOutlineLogout } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { FaRegComments } from 'react-icons/fa';
import { BiMessageSquareDots } from 'react-icons/bi';
import { AiOutlineCar } from 'react-icons/ai';
import { RiBillLine } from 'react-icons/ri';
import { BsFillFileTextFill } from 'react-icons/bs';
import { AiOutlineQuestionCircle } from 'react-icons/ai';


function SideNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div>
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group md:hidden">
              <GiHamburgerMenu className="block h-6 w-6" aria-hidden="true" />
            </Disclosure.Button>
            <div className={`p-6 w-1/2 h-screen bg-green-50 z-20 fixed top-0 transition-transform duration-200 ${open ? 'left-0' : '-left-full'} md:left-0 md:w-60`}>
              <div className="flex flex-col justify-start items-center">
                <img src="/images/logo2.png" alt="Logo" className="w-32 mb-4" />
                <div className="my-4 border-b border-gray-100 pb-4 w-full">
                  <NavItem href="/dashboard" icon={<MdOutlineSpaceDashboard />} label="Dashboard" />
                  <NavItem href="/profile" icon={<CgProfile />} label="Profile" />
                  <NavItem href="/booking" icon={<FaRegComments />} label="Booking" />
                  <NavItem href="/consumers" icon={<BiMessageSquareDots />} label="Consumers" />
                  <NavItem href="/cars" icon={<AiOutlineCar />} label="Cars" />
                  <NavItem href="/blogs" icon={<BsFillFileTextFill />} label="Blogs" />
                  <NavItem href="/faq" icon={<AiOutlineQuestionCircle />} label="FAQs" />
                  <NavItem href="/facturation" icon={<RiBillLine />} label="Facturation" />
                </div>
                <div className="my-4 w-full">
                  <div onClick={handleLogout} className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white" />
                    <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">Logout</h3>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}

const NavItem = ({ href, icon, label }) => (
  <Link href={href} passHref>
    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
      <div className="text-2xl text-gray-600 group-hover:text-white">{icon}</div>
      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">{label}</h3>
    </div>
  </Link>
);

export default SideNavbar;
