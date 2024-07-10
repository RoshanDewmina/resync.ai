// // Hero.js
// "use client";
// import { useState } from "react";
// import { Dialog, DialogPanel } from "@headlessui/react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import Image from "next/image";
// import Link from "next/link";
// import Background from "../../background";
// import { buttonVariants } from "@/components/ui/button";
// import { SparklesCore } from "@/components/magicui/sparkles";

// // Navigation items
// const navigation = [
//   { name: "Docs", href: "#" },
//   { name: "Features", href: "#" },
//   { name: "Showcase", href: "#" },
//   { name: "Pricing", href: "#" },
// ];

// export default function Hero() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <div className="relative min-h-screen">
//       <Header
//         mobileMenuOpen={mobileMenuOpen}
//         setMobileMenuOpen={setMobileMenuOpen}
//       />
//       {/* <Background /> */}
//       <HeroContent />
//     </div>
//   );
// }

// // Header component containing navigation and mobile menu
// function Header({
//   mobileMenuOpen,
//   setMobileMenuOpen,
// }: {
//   mobileMenuOpen: boolean;
//   setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   return (
//     <header className="absolute inset-x-0 top-0 z-50">
//       <nav
//         className="flex items-center justify-between p-6 lg:px-8"
//         aria-label="Global"
//       >
//         <div className="flex lg:flex-1">
//           <Link href="/" className="-m-1.5 p-1.5">
//             <span className="sr-only">reTrace</span>
//             {/* <Image className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" width={8} height={8} /> */}
//           </Link>
//         </div>
//         <MobileMenuButton setMobileMenuOpen={setMobileMenuOpen} />
//         <DesktopNavigation />
//         <DesktopLogin />
//       </nav>
//       <MobileMenu
//         mobileMenuOpen={mobileMenuOpen}
//         setMobileMenuOpen={setMobileMenuOpen}
//       />
//     </header>
//   );
// }

// // Button for opening the mobile menu
// function MobileMenuButton({
//   setMobileMenuOpen,
// }: {
//   setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   return (
//     <div className="flex lg:hidden">
//       <button
//         type="button"
//         className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
//         onClick={() => setMobileMenuOpen(true)}
//       >
//         <span className="sr-only">Open main menu</span>
//         <Bars3Icon className="h-6 w-6" aria-hidden="true" />
//       </button>
//     </div>
//   );
// }

// // Navigation for larger screens
// function DesktopNavigation() {
//   return (
//     <div className="hidden lg:flex lg:gap-x-12">
//       {navigation.map((item) => (
//         <Link
//           key={item.name}
//           href={item.href}
//           className="text-sm font-semibold leading-6 text-gray-900"
//         >
//           {item.name}
//         </Link>
//       ))}
//     </div>
//   );
// }

// // Login link for larger screens
// function DesktopLogin() {
//   return (
//     <div className="hidden lg:flex lg:flex-1 lg:justify-end">
//       <Link
//         href="/sign-in"
//         className="text-sm font-semibold leading-6 text-gray-900"
//       >
//         Sign In <span aria-hidden="true">&rarr;</span>
//       </Link>
//     </div>
//   );
// }

// // Mobile menu component
// function MobileMenu({
//   mobileMenuOpen,
//   setMobileMenuOpen,
// }: {
//   mobileMenuOpen: boolean;
//   setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   return (
//     <Dialog
//       className="lg:hidden"
//       open={mobileMenuOpen}
//       onClose={setMobileMenuOpen}
//     >
//       <div className="fixed inset-0 z-50" />
//       <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
//         <div className="flex items-center justify-between">
//           <Link href="/" className="-m-1.5 p-1.5">
//             <span className="sr-only">Resync</span>
//             {/* <Image className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" width="8" height="8" alt="" /> */}
//           </Link>
//           <button
//             type="button"
//             className="-m-2.5 rounded-md p-2.5 text-gray-700"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             <span className="sr-only">Close menu</span>
//             <XMarkIcon className="h-6 w-6" aria-hidden="true" />
//           </button>
//         </div>
//         <div className="mt-6 flow-root">
//           <div className="-my-6 divide-y divide-gray-500/10">
//             <div className="space-y-2 py-6">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//             <div className="py-6">
//               <Link
//                 href="/sign-in"
//                 className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
//               >
//                 Sign In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </DialogPanel>
//     </Dialog>
//   );
// }

// // Main hero content component
// function HeroContent() {
//   return (
//     <>
//       <div className="relative isolate px-6 pt-14 lg:px-8">
//         <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
//           <div className="hidden sm:mb-8 sm:flex sm:justify-center">
//             <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
//               Get Started Today - Transform Your User Support.{" "}
//               <Link href="#" className="font-semibold text-indigo-600">
//                 <span className="absolute inset-0" aria-hidden="true" />
//                 Learn more <span aria-hidden="true">&rarr;</span>
//               </Link>
//             </div>
//           </div>
//           <div className="w-full absolute inset-0 h-screen -z-[10]">
//             <SparklesCore
//               id="tsparticlesfullpage"
//               background="transparent"
//               minSize={0.6}
//               maxSize={1.4}
//               particleDensity={20}
//               className="w-full h-full"
//               // particleColor="#FFFFFF"
//               particleColor="#C3B1E1"
//             />
//           </div>
//           <div className="text-center">
//             <h1 className="text-4xl font-bold tracking-tight text-gray-600 sm:text-6xl">
//               Turns Your Content into Answers with
//               <br />
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-violet-800">
//                 Resync
//               </span>
//             </h1>
//             <p className="mt-6 text-lg leading-8 text-gray-600">
//               Provide your users with accurate, real-time responses you can
//               trust.
//               <br />
//               Enhance user satisfaction and <span className="font-bold">reduce customer support</span> needs
//               with Resync.
//             </p>
//             <div className="mt-10 flex items-center justify-center gap-x-6">
//               <Link
//                 href="/overview"
//                 className="rounded-md  bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Get started
//               </Link>
//               <Link
//                 href="/docs"
//                 // className="text-sm font-semibold leading-6 text-gray-900"
//                 className={buttonVariants({ variant: "ghost" })}
//               >
//                 Learn more <span aria-hidden="true">→</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// Hero.tsx
"use client";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SparklesCore } from "@/components/magicui/sparkles";

type NavigationItem = {
  name: string;
  ref: string;
};

const navigation: NavigationItem[] = [
  { name: "How It Works", ref: "howitworksRef" },
  { name: "Pricing", ref: "pricingRef" },
  { name: "Contact Us", ref: "newsletterRef" },
];

type HeroProps = {
  scrollToSection: (ref: React.RefObject<HTMLElement>) => void;
  howitworksRef: React.RefObject<HTMLElement>;
  pricingRef: React.RefObject<HTMLElement>;
  newsletterRef: React.RefObject<HTMLElement>;
};

export default function Hero({
  scrollToSection,
  howitworksRef,
  pricingRef,
  newsletterRef,
}: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigationClick = (refName: string) => {
    const sectionRef = { howitworksRef, pricingRef, newsletterRef }[refName];
    scrollToSection(sectionRef as any);
  };

  return (
    <div className="relative min-h-screen">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleNavigationClick={handleNavigationClick}
      />
      <HeroContent />
    </div>
  );
}

type HeaderProps = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleNavigationClick: (refName: string) => void;
};

function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
  handleNavigationClick,
}: HeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">reTrace</span>
            {/* <Image className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" width={8} height={8} /> */}
          </Link>
        </div>
        <MobileMenuButton setMobileMenuOpen={setMobileMenuOpen} />
        <DesktopNavigation handleNavigationClick={handleNavigationClick} />
        <DesktopLogin />
      </nav>
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleNavigationClick={handleNavigationClick}
      />
    </header>
  );
}

type MobileMenuButtonProps = {
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function MobileMenuButton({ setMobileMenuOpen }: MobileMenuButtonProps) {
  return (
    <div className="flex lg:hidden">
      <button
        type="button"
        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        onClick={() => setMobileMenuOpen(true)}
      >
        <span className="sr-only">Open main menu</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}

type DesktopNavigationProps = {
  handleNavigationClick: (refName: string) => void;
};

function DesktopNavigation({
  handleNavigationClick,
}: DesktopNavigationProps) {
  return (
    <div className="hidden lg:flex lg:gap-x-12">
      {navigation.map((item) => (
        <button
          key={item.name}
          onClick={() => handleNavigationClick(item.ref)}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

function DesktopLogin() {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
      <Link
        href="/sign-in"
        className="text-sm font-semibold leading-6 text-gray-900"
      >
        Sign In <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

type MobileMenuProps = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleNavigationClick: (refName: string) => void;
};

function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  handleNavigationClick,
}: MobileMenuProps) {
  return (
    <Dialog
      className="lg:hidden"
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
    >
      <div className="fixed inset-0 z-50" />
      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Resync</span>
            {/* <Image className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" width="8" height="8" alt="" /> */}
          </Link>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigationClick(item.ref);
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="py-6">
              <Link
                href="/sign-in"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
}

function HeroContent() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Get Started Today - Transform Your User Support.{" "}
            <Link href="#" className="font-semibold text-indigo-600">
              <span className="absolute inset-0" aria-hidden="true" />
              Learn more <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="w-full absolute inset-0 h-screen -z-[10]">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={20}
            className="w-full h-full"
            particleColor="#C3B1E1"
          />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-600 sm:text-6xl">
            Turns Your Content into Answers with
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-violet-800">
              Resync
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Provide your users with accurate, real-time responses you can
            trust.
            <br />
            Enhance user satisfaction and <span className="font-bold">reduce customer support</span> needs
            with Resync.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/overview"
              className="rounded-md  bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <Link
              href="/docs"
              className={buttonVariants({ variant: "ghost" })}
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
