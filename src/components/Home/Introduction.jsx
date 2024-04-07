import clsx from 'clsx';
import styles from './index.module.scss';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';

import { FaAngleRight } from 'react-icons/fa6';
import './index.scss';

export const Introduction = () => {
return (
<main className={clsx('container', styles.introduction)}>
  <h2>Principles</h2>
  <p>
    <b style={{ color: 'var(--primary)' }}>bamboost</b> is a Python package that implements a{' '}
    <span className="hl">file-based database system for scientific data</span>. It is designed
    to be usable with <span className="hl">0 setup</span>. The package is built around a simple{' '}
    <a href="#data-model">data model</a>, where the general idea is to store data in HDF5 files
    embedded in a minimal hierarchical structure. We adhere to the following principles:
  </p>
  <ol>
    <li>
      <b>The data is self-describing</b>{' '}
      <i>thus, fully comprehensible without knowledge of bamboost</i>
    </li>
    <li>
      <b>No system setup</b>
    </li>
    <li>
      <b>Any additional functionality must be "optional"</b>
    </li>
  </ol>

  <h2 id="data-model">Data model</h2>
  <div className="data-model">
    <div className="box db">
      <div className="head">Database</div>
      <ul>
        <li>a unit of self-similar simulations</li>
        <li>assigned a unique ID</li>
        <li>is a directory</li>
      </ul>
    </div>
    <FaAngleRight className="icon" />
    <div className="box sim">
      <div className="head">Simulation</div>
      <ul>
        <li>assigned (or given) a unique ID (or name)</li>
        <li>one subdirectory per simulation</li>
      </ul>
    </div>
    <FaAngleRight className="icon" />
    <div className="box data">
      <div className="head">Data</div>
      <ul>
        <li>
          one <i>main</i> HDF5 file for data
        </li>
        <li>execution scripts</li>
        <li>submission scripts</li>
        <li>any other files and/or folders</li>
      </ul>
    </div>
  </div>
  <p>
    The biggest unit of this model is a <span className="hl">database</span>, serving as a
    container for simulations. On disk, a database is just a directory housing subdirectories
    for individual simulations. Every database is assigned a unique ID, which is used to
    identify the database in a more robust way than using it's path. Every{' '}
    <span className="hl">simulation</span> within a database is a subdirectory named after the
    simulation ID. Within each simulation directory, a primary HDF5 file is used to store all
    data along with metadata (input parameters, time of creation, used resources, etc.).
    Additionally, users have the flexibility to store supplementary files (input files,
    execution scripts, images, etc.) the simulation's directory.
  </p>

  <p>
    Ideally, every database contains self similar simulations which are comparable, implying
    similarity in the nature of the data. For instance, we might have a database for simulations
    of a particular parametric study or a database for simulations of a specific system with
    varying initial conditions. When working on a discretized problem, we might have an
    additional databaase containing our meshes.
  </p>

  <pre>
    {`Database_A
    |-- simulation_1
    | |-- simulation_1.h5
    | |-- additional_file_1.txt
    | |-- additional_file_2.csv
    |-- simulation_2
    | |-- simulation_2.h5
    | |-- additional_file_3.txt`}
  </pre>

  <h2>Features</h2>
  <h3>Query simulations</h3>
  <p>
    Use simulation parameters and metadata to query your data. Use{' '}
    <span className="hl">pandas</span> to filter, sort and query data from the database. No more
    remembering the exact name of the simulation you are looking for.
  </p>

  <h3>Intuitive writing and reading of data</h3>
  <p>
    Access data from disk like memory. We provide a simple API to write and read data from a
    specific simulation. The data is stored in HDF5 format, which is a widely used format for
    scientific data. Only the requested data is loaded into memory, making it efficient for
    large datasets.
  </p>
  <CodeBlock language="py" title="Reading">
    {"stress = sim.data['stress'][:]\n"}
    {"energy = sim.globals['energy'][:]"}
  </CodeBlock>
  <CodeBlock language="py" title="Writing">
    {'sim.step = 0\n'}
    {"sim.add_field('stress', array)\n"}
    {"sim.add_global_field('energy', 3.14)"}
  </CodeBlock>

  <h3>Database indexing</h3>
  <p>
    Every database is assigned a unique ID. The database is indexed for quick lookup. This
    allows for safe referencing to data which would not be possible when hard-coding paths.
  </p>

  <h3>Workflow manager</h3>
  <p>
    We simplify job creation and it's submission on HPC clusters. Based at ETH, we provide
    functionality for it's cluster system. Create many jobs for a parametric study in a single
    for-loop, creating a simulation entry in each and immediately submit the job to the cluster.
  </p>

  <div className="goto">
    <Link className="btn btn-outline" to="docs/documentation/get-started/basic_usage">
    Basic usage
    </Link>
  </div>
</main>
);
};
