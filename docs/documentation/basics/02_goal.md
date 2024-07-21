
# Goal

Finding the right data in a large amount of files is hard. By using a database,
we can query the right data by its parameters or metadata. Data is stored
automatically and the naming is no longer important. Unfortunately, most
database solutions require significant initial setup and maintenance. The goal
is to provide a database system with **zero overhead**.

:::info[Why bamboost?]

- No setup required.
- Uses HDF5 to store data, allowing fast and specific access to your data.
- Minimizes the number of files.
- Create new databases on the fly.
- Add new entries to a database with a single command.
- Helps you to generate jobs, specifically on ETH's Euler cluster.

:::

## Concept

The fundamental unit in this framework is a database, serving as a container for
organized data, containing simulations. Conceptually, a database is a directory
housing subdirectories for individual simulations. Within each simulation
directory, a primary HDF5 file is present, storing all metadata and data.
Additionally, users have the flexibility to store supplementary files within the
simulation directory.

```
Database_A
|-- Simulation_1
|   |-- simulation_1.h5
|   |-- additional_file_1.txt
|   |-- additional_file_2.csv
|-- Simulation_2
|   |-- simulation_2.h5
|   |-- additional_file_3.txt
```

The goal is to maintain comparability within a single database, implying
similarity in the nature of the data. For instance, you might have a
database for simulations of a parametric study or a database for simulations of a
specific system with varying initial conditions.

