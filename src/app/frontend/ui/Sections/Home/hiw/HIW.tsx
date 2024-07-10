import React from "react";
import { AnimatedBeamDemo } from "./_components/animated-ingest-demo";
import { AnimatedBeamMultipleInputDemo } from "./_components/animated-multiple-input-demo";

const HIW = () => {
  return (
    <>
      <div className="mx-auto max-w-2xl sm:text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {/* How Resync works  */}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Our LLM provides real-time, curated responses to user queries,
          reducing the need for direct support and enhancing user satisfaction.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:max-w-none grid md:grid-cols-3 gap-4">
        <div className="p-2 lg:w-full">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 flex flex-col justify-center lg:py-16 h-full">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-xl font-semibold text-gray-600">
                1. Ingest Data
              </p>
              <p className="mt-6 text-s leading-5 text-gray-600">
                Upload your documents
              </p>
              {/* <div className="flex items-center justify-center ring-1 ring-gray-200 p-2 rounded-xl mt-6 mx-auto">
                <AnimatedBeamDemo />
              </div> */}
            </div>
          </div>
        </div>

        <div className="p-2 lg:w-full">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 flex flex-col justify-center lg:py-16 h-full">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-xl font-semibold text-gray-600">
                Seamless Integration
              </p>
              <p className="mt-6 text-s leading-5 text-gray-600">
                Integrating our bot into your website
              </p>
            </div>
          </div>
        </div>

        <div className="p-2 lg:w-full">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 flex flex-col justify-center lg:py-16 h-full">
            <div className="mx-auto max-w-xs">
              <p className="text-xl font-semibold text-gray-600">
                Enhanced Customer Experience
              </p>
              <p className="mt-6 text-s leading-5 text-gray-600">
                Your customers can interact with the bot and ask any questions related to the documents you
                {"'"}ve uploaded
              </p>
              {/* <div className="flex items-center justify-center ring-1 ring-gray-200 p-2 rounded-xl mt-6 mx-auto my-auto">
                <AnimatedBeamMultipleInputDemo />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HIW;
