import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  PencilSquareIcon,
  LightBulbIcon,
} from "@heroicons/react/20/solid";
import {
  HeartIcon,
  ChartBarIcon,
  HandThumbUpIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  FolderOpenIcon,
} from "@heroicons/react/20/solid";

import Image from "next/image";
import Background from "../../background";

import { ZapIcon, HandHelpingIcon, QrCodeIcon, BookOpenCheckIcon, MessageSquare} from "lucide-react";

const features = [
  {
    name: "Easy Integration",
    description:
      "Seamlessly integrate our AI RAG bot with your systems using our ready-to-go components and APIs. Get started quickly and effortlessly.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Multi-Format Data Ingestion",
    description:
      "Ingest data from websites, PDFs, TXT files, CSVs, and most other formats with ease, ensuring comprehensive data coverage.",
    icon: QrCodeIcon,
  },
  {
    name: "Accurate & Reliable Responses",
    description:
      "Provide scenario-specific help with accurate, curated responses that stay on topic and admit when the bot doesn’t know.",
    icon: MessageSquare,
  },
  {
    name: "Insightful Documentation Improvement",
    description:
      "Receive actionable insights on your documentation to enhance and refine it where necessary.",
    icon: BookOpenCheckIcon,
  },
  {
    name: "Instant Curated Responses",
    description:
      "Deliver immediate, curated responses to users when they search or ask for information, improving their experience.",
    icon: ZapIcon,
  },
  {
    name: "Comprehensive Analytics",
    description:
      "Understand user needs better with analytics that reveal where users are getting stuck and what they are searching for.",
    icon: ChartBarIcon,
  },
  {
    name: "Reduced Support Volume",
    description:
      "Significantly reduce your support volume with authentic self-help experiences, detecting common questions and addressing them proactively.",
    icon: HandHelpingIcon,
  },
];

export default function Features() {
  return (
    <div className="overflow-hidden py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Provide Solutions Faster
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                A better experience to the User
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Real-time curated responses, reducing the need for direct
                support and enhancing user satisfaction with personalized,
                context-aware answers.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            src="/features.jpeg"
            alt="Product screenshot"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  );
}
