import { useState } from "react";
import { CalendarDaysIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@nextui-org/react";
import { MessageCircle, HelpCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/help/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, content }),
      });
      if (response.ok) {
        alert("Your message has been sent!");
      } else {
        alert("There was an error sending your message.");
      }
    } catch (error) {
      alert("There was an error sending your message.");
    }
  };

  return (
    <div className="relative isolate bg-white overflow-visible py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 ring-1 ring-slate-200 p-6 rounded-xl">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 rounded-lg p-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Contact Us
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Contact us for enterprise solutions and plans based on your specific needs.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex-col max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="content"
                name="content"
                type="text"
                required
                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="Enter your message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Button
                color="primary"
                variant="shadow"
                type="submit"
                className="flex-none rounded-md  px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Send
              </Button>
            </form>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            {/* <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <CalendarDaysIcon
                  className="h-6 w-6 text-black"
                  aria-hidden="true"
                />
              </div>
              <dt className="mt-4 font-semibold text-black">Weekly articles</dt>
              <dd className="mt-2 leading-7 text-gray-600">
                Stay updated with our latest insights and articles on various topics including technology, business, and more.
              </dd>
            </div> */}
            {/* <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <HandRaisedIcon
                  className="h-6 w-6 text-black"
                  aria-hidden="true"
                />
              </div>
              <dt className="mt-4 font-semibold text-black">No spam</dt>
              <dd className="mt-2 leading-7 text-gray-600">
                We value your privacy. Receive only relevant and useful information, no spam.
              </dd>
            </div> */}
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <MessageCircle
                  className="h-6 w-6 text-black"
                  aria-hidden="true"
                />
              </div>
              <dt className="mt-4 font-semibold text-black">24/7 Support</dt>
              <dd className="mt-2 leading-7 text-gray-600">
                Our support team is available 24/7 to assist you with any questions or issues.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <HelpCircle
                  className="h-6 w-6 text-black"
                  aria-hidden="true"
                />
              </div>
              <dt className="mt-4 font-semibold text-black">Custom Solutions</dt>
              <dd className="mt-2 leading-7 text-gray-600">
                We offer tailored solutions to meet your unique business needs and goals.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        className="absolute left-1/2 top-[-10%] -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
