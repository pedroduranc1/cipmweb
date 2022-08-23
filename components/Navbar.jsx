import React, { useState } from 'react'
import Link from 'next/link'

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  BookmarkAltIcon,
  CalendarIcon,
  FilmIcon,
  ChatIcon,
  HomeIcon,
  MenuIcon,
  PhoneIcon,
  PlayIcon,
  RefreshIcon,
  ShieldCheckIcon,
  SupportIcon,
  ViewGridIcon,
  XIcon,
} from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'

const solutions = [
  {
    name: 'Inicio',
    description: 'Get a better understanding of where your traffic is coming from.',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'Videos',
    description: 'Speak directly to your customers in a more meaningful way.',
    href: '/videos/cimp',
    icon: FilmIcon,
  },
  {
    name: 'Contacto',
    description: "Connect with third-party tools that you're already using.",
    href: '/contactos',
    icon: ChatIcon,
  },
]
const callsToAction = [
  { name: 'Watch Demo', href: '#', icon: PlayIcon },
  { name: 'Contact Sales', href: '#', icon: PhoneIcon },
]
const resources = [
  {
    name: 'Help Center',
    description: 'Get all of your questions answered in our forums or contact support.',
    href: '#',
    icon: SupportIcon,
  },
  {
    name: 'Guides',
    description: 'Learn how to maximize our platform to get the most out of it.',
    href: '#',
    icon: BookmarkAltIcon,
  },
  {
    name: 'Events',
    description: 'See what meet-ups and other events we might be planning near you.',
    href: '#',
    icon: CalendarIcon,
  },
  { name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: ShieldCheckIcon },
]
const recentPosts = [
  { id: 1, name: 'Boost your conversion rate', href: '#' },
  { id: 2, name: 'How to use search engine optimization to drive traffic to your site', href: '#' },
  { id: 3, name: 'Improve your customer experience', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export const Navbar = () => {
  const [videoname, setvideoname] = useState("cimp")
  return (
    <Popover className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <a className='flex'>
                <img
                  className="h-14 w-auto sm:h-15"
                  src="/logo.svg"
                  alt=""
                />
                <h1 className='grid items-center font-bold ml-2'>C.I.M.P</h1>
              </a>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link href="/">
              <a href="/" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                Inicio
              </a>
            </Link>
            <Link href="/videos/cimp">
              <a className="whitespace-nowrap text-base font-medium ml-10 text-gray-500 hover:text-gray-900">
                Videos
              </a>
            </Link>
            <Link href="/contactos">
              <a className="whitespace-nowrap text-base font-medium ml-10 text-gray-500 hover:text-gray-900">
                Contacto
              </a>
            </Link>

            <div className="flex items-center justify-center ml-10">
              <div className="flex border-2 rounded">
                <input type="text" onChange={(e) => { setvideoname(e.target.value) }} className="px-4 py-2 w-40 selection:border-gray-500" placeholder="Search..." />
                <Link href={`/videos/${encodeURIComponent(videoname)}`}>
                  <a className="flex cursor-pointer items-center justify-center px-4 border-l">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24">
                      <path
                        d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                    </svg>
                  </a>
                </Link>
              </div>
            </div>

            <img
              className="h-8 w-auto sm:h-7 hover:cursor-pointer ml-10"
              src="/ws.svg"
              alt=""
              onClick={() => {
                window.location.href = "https://wa.link/8ebgdv";
              }}
            />

            <img
              className="h-8 w-auto sm:h-7 hover:cursor-pointer ml-3"
              src="/fb.svg"
              alt=""
              onClick={() => {
                window.location.href = "https://www.facebook.com/olympusgroupmx";
              }}
            />

            <img
              className="h-8 w-auto sm:h-7 hover:cursor-pointer ml-3"
              src="/tiktok.svg"
              alt=""
              onClick={() => {
                window.location.href = "https://www.tiktok.com/@adrianlealcaldera?lang=en";
              }}
            />

          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel focus className="absolute z-50 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div className='flex'>
                  <img
                    className="h-12 w-auto"
                    src="/logo.svg"
                    alt="Workflow"
                  />
                  <h1 className='grid items-center font-bold ml-2'>C.I.M.P</h1>
                </div>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {solutions.map((item) => (
                    <Link
                      key={item.name}
                      href={`${item.href}`}>
                      <a
                        className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                      >
                        <item.icon className="flex-shrink-0 h-6 w-6 text-gray-600" aria-hidden="true" />
                        <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div>
                <div className="flex items-center w-full justify-center">
                  <div className="flex border-2 w-full rounded">
                    <input type="text" className="px-4 py-2 w-full selection:border-gray-500" placeholder="Search..." />
                    <button className="flex items-center justify-center px-4 border-l">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                          d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className='w-full mt-6 flex justify-around'>
                  <img
                    className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                    src="/ws.svg"
                    alt=""
                    onClick={() => {
                      window.location.href = "https://wa.link/8ebgdv";
                    }}
                  />

                  <img
                    className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                    src="/fb.svg"
                    alt=""
                    onClick={() => {
                      window.location.href = "https://www.facebook.com/olympusgroupmx";
                    }}
                  />

                  <img
                    className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                    src="/tiktok.svg"
                    alt=""
                    onClick={() => {
                      window.location.href = "https://www.tiktok.com/@adrianlealcaldera?lang=en";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
