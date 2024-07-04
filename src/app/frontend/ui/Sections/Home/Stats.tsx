import Background from "../../background";

const stats = [
  { id: 1, name: "Reduction in Support Queries", value: `80%` },
  { id: 2, name: "Improvement in Documentation Quality", value: "40%" },
  {
    id: 3,
    name: "Over reported they had a better experience with reTrace",
    value: "70%",
  },
];

export default function Stats() {
  return (
    <div className=" pt-36 sm:py-16">
      {/* <Background /> */}

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
