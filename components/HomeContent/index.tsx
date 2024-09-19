import React from "react";
import styles from "./HomeContent.module.css";
import cn from "clsx";
import MyFileTree from "./FileTree";
import { CodeBlock } from "../Code";

const FeatureCard = ({
  children,
  className,
}: {
  children: any;
  className?: string;
}) => (
  <div
    className={cn(
      "relative border-[0.5px] border-gray-500 dark:shadow-black shadow-xl rounded-3xl p-8",
      className,
    )}
  >
    {children}
  </div>
);

const codeManager = `db = Manager('my_database')

search_params = {
  'parameter_1': 0.5,
  'parameter_2': 'foo',
}
matches = db.sims(search_params)
for sim in matches:
  print(sim.uid)
`;

const codeWriting = `
sim = db.create_simulation(
    "my_simulation", parameters={"parameter_1": 0.5, "parameter_2": "foo"}
)
sim.add_mesh(coordinates, connectivity)
sim.add_field("displacement", data)
sim.add_global_field("free energy", 42)
`;

const codeReading = `
sim = db['my_simulation']
# read displacement for all steps
disp = sim.data['displacement'][:]
# get displacement of last step at node 42
disp_last = sim.data['displacement'][-1, 42]

`;

const ContentGrid = () => {
  return (
    <div className="grid gap-4 items-stretch my-12 md:mx-12 lg:mx-0 grid-cols-1 md:grid-cols-2">
      <FeatureCard
        className={cn("w-full space-y-5 text-3xl font-bold bg-card")}
      >
        <div className="drop-shadow">
          File-based data model using{" "}
          <span className="italic font-normal">HDF5</span>{" "}
        </div>
        <MyFileTree className="font-normal text-base border border-gray-500 rounded-md p-3 shadow-inner" />
      </FeatureCard>
      <FeatureCard className={cn(styles.cardTUI, "")}>
        <div className="text-3xl font-bold h-80 flex flex-col justify-center">
          <div className="max-w-60 drop-shadow">Terminal user interface</div>
        </div>
      </FeatureCard>
      <FeatureCard className="md:col-span-2 bg-gradient-to-br from-primary to-bg">
        <div className="flex flex-col justify-center">
          <div className="drop-shadow text-3xl font-bold">
            Extensive python API{" "}
            <img className="h-12 inline-block" src="/python-logo-only.png" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            <div className="flex flex-col">
              <h3>Manager</h3>
              <CodeBlock
                className="h-full bg-[var(--github-bg)] shadow-xl"
                language="python"
                code={codeManager}
              />
            </div>
            <div className="flex flex-col">
              <h3>Simulation writing</h3>
              <CodeBlock
                className="md:h-full bg-[var(--github-bg)] shadow-xl"
                language="python"
                code={codeWriting}
              />
            </div>
            <div className="flex flex-col">
              <h3>Simulation reading</h3>
              <CodeBlock
                className="md:h-full bg-[var(--github-bg)] shadow-xl"
                language="python"
                code={codeReading}
              />
            </div>
          </div>
        </div>
      </FeatureCard>
      <FeatureCard
        className={cn(
          "w-full space-y-5 text-3xl font-bold bg-bg md:col-span-2",
        )}
      >
        <div className="drop-shadow md:inline-block">
          Enriched with <span className="font-normal italic">SQLite</span>{" "}
          <div className="md:inline-block">
            for fast queries in all your data
          </div>
        </div>
      </FeatureCard>
      <div className="grid md:grid-cols-3 col-span-full gap-4 text-center">
        <FeatureCard
          className={cn(
            "w-full space-y-5 text-3xl font-bold bg-card flex justify-center items-center",
          )}
        >
          <div className="drop-shadow">Job submission and monitoring</div>
        </FeatureCard>
        <FeatureCard
          className={cn(
            "w-full space-y-5 text-3xl font-bold bg-card flex justify-center items-center",
          )}
        >
          <div className="drop-shadow">Live data access</div>
        </FeatureCard>
        <FeatureCard
          className={cn(
            "w-full space-y-5 text-3xl font-bold bg-card flex justify-center items-center",
          )}
        >
          <div className="drop-shadow">
            <span className="italic font-normal">
              MPI
              <br />
            </span>{" "}
            support for writing and reading
          </div>
        </FeatureCard>
      </div>
    </div>
  );
};

export default ContentGrid;
