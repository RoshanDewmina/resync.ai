"use client";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Background from "../../background";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const includedFeatures = [
  "Private forum access",
  "Member resources",
  "Entry to annual conference",
  "Official member t-shirt",
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleToggle = () => {
    setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly");
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Only Pay For What You Use
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 align-middle">
            Your tokens never expire!
            <br />
            Any unused tokens from previous months roll over and can be used
            anytime. Even if you pause or cancel your subscription, your
            accumulated tokens remain valid and ready for use whenever you
            return.
            <br />
            Enjoy worry-free credit accumulation!
          </p>
        </div>
        {/* <div className="p-4 sm:p-10 lg:flex-auto overflow-hidden">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Pricing
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Experience seamless integration with our AI RAG bot that ingests
            data from any source, provides accurate responses, and improves your
            documentation.
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
              What’s included
            </h4>
            <div className="h-px flex-auto bg-gray-100" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
          >
            {includedFeatures.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-indigo-600"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div> */}
        <div className="mt-8 flex flex-col justify-center items-center space-x-2">
          <Switch id="billing-mode" onClick={handleToggle} />
          <Label
            htmlFor="billing-mode"
            className="mt-6 text-base leading-7 text-gray-600"
          >
            {billingCycle === "monthly"
              ? "Switch to Yearly"
              : "Switch to Monthly"}
          </Label>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:max-w-none grid md:grid-cols-3 gap-4">
          {billingCycle === "monthly" && (
            <>
              <div className="p-2 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold text-gray-600">
                      Launch
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">
                        $39
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                        /month
                      </span>
                    </p>
                    <a
                      href="#"
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </a>
                    <p className="mt-6 text-xs leading-5 text-gray-600">
                      Invoices and receipts available for easy company
                      reimbursement
                    </p>
                  </div>

                  <div className="mt-10 flex-col gap-x-4">
                    <h4 className="flex text-sm px-12 pb-6 font-semibold leading-6 text-indigo-600">
                      What’s included
                    </h4>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Projects: 1
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Integrations Per Project: 1
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Tokens: 2500
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Storage (GB): 1
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        GPT Model: OpenAI gpt-3.5
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Optional tokens purchase
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Out of the Box componets
                      </p>
                    </div>

                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                </div>
              </div>

              <div className="p-2 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold text-gray-600">
                      Accelerate
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">
                        $89
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                        /month
                      </span>
                    </p>
                    <a
                      href="#"
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </a>
                    <p className="mt-6 text-xs leading-5 text-gray-600">
                      Invoices and receipts available for easy company
                      reimbursement
                    </p>
                  </div>
                  <div className="mt-10 flex-col gap-x-4">
                    <h4 className="flex text-sm px-12 pb-6 font-semibold leading-6 text-indigo-600">
                      What’s included
                    </h4>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Projects: 3
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Integrations Per Project: 3
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Tokens: 10000
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Storage (GB): 5
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        GPT Model: OpenAI gpt-4o
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Optional tokens purchase
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Out of the Box componets
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Usage Analytics
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Insights on documentation gaps
                      </p>
                    </div>

                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                </div>
              </div>

              <div className="p-2 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold text-gray-600">
                      Scale
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">
                        $159
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                        /month
                      </span>
                    </p>
                    <a
                      href="#"
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </a>
                    <p className="mt-6 text-xs leading-5 text-gray-600">
                      Invoices and receipts available for easy company
                      reimbursement
                    </p>
                  </div>
                  <div className="mt-10 flex-col gap-x-4">
                    <h4 className="flex text-sm px-12 pb-6 font-semibold leading-6 text-indigo-600">
                      What’s included
                    </h4>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Projects: 5
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Integrations Per Project: 3
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Tokens: 250000
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Storage (GB): 10
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        GPT Model: OpenAI gpt-4o
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Optional tokens purchase
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Out of the Box componets
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Usage Analytics
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Insights on documentation gaps
                      </p>
                    </div>

                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                </div>
              </div>
            </>
          )}

          {billingCycle === "yearly" && (
            <>
              <div className="p-2 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold text-gray-600">
                      Launch
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">
                        $29
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                        /month
                      </span>
                    </p>
                    <a
                      href="#"
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </a>
                    <p className="mt-6 text-xs leading-5 text-gray-600">
                      Invoices and receipts available for easy company
                      reimbursement
                    </p>
                  </div>
                  <div className="mt-10 flex-col gap-x-4">
                    <h4 className="flex text-sm px-12 pb-6 font-semibold leading-6 text-indigo-600">
                      What’s included
                    </h4>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Projects: 1
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Integrations Per Project: 1
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Tokens: 2500
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Storage (GB): 1
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        GPT Model: OpenAI gpt-3.5
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Optional tokens purchase
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Out of the Box componets
                      </p>
                    </div>
                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                </div>
              </div>

              <div className="p-2 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold text-gray-600">
                      Accelerate
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">
                        $69
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                        /month
                      </span>
                    </p>
                    <a
                      href="#"
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </a>
                    <p className="mt-6 text-xs leading-5 text-gray-600">
                      Invoices and receipts available for easy company
                      reimbursement
                    </p>
                  </div>
                  <div className="mt-10 flex-col gap-x-4">
                    <h4 className="flex text-sm px-12 pb-6 font-semibold leading-6 text-indigo-600">
                      What’s included
                    </h4>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Projects: 3
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Integrations Per Project: 3
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Tokens: 10000
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Storage (GB): 5
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        GPT Model: OpenAI gpt-4o
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Optional tokens purchase
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Out of the Box componets
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Usage Analytics
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Insights on documentation gaps
                      </p>
                    </div>

                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                </div>
              </div>

              <div className="p-2 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold text-gray-600">
                      Scale
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">
                        $139
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                        /month
                      </span>
                    </p>
                    <a
                      href="#"
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </a>
                    <p className="mt-6 text-xs leading-5 text-gray-600">
                      Invoices and receipts available for easy company
                      reimbursement
                    </p>
                  </div>
                  <div className="mt-10 flex-col gap-x-4">
                    <h4 className="flex text-sm px-12 pb-6 font-semibold leading-6 text-indigo-600">
                      What’s included
                    </h4>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Projects: 5
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Integrations Per Project: 3
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Tokens: 250000
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Max Storage (GB): 10
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        GPT Model: OpenAI gpt-4o
                      </p>
                    </div>
                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Optional tokens purchase
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Out of the Box componets
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Usage Analytics
                      </p>
                    </div>

                    <div className="flex px-14">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600"
                        aria-hidden="true"
                      />
                      <p className="pl-2 text-xs text-grey-600 leading-7">
                        Insights on documentation gaps
                      </p>
                    </div>

                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
