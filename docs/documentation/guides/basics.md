# Basics

In bamboost, databases are created implicitly if they do not exist yet.
To get started, create your first database by creating a `Manager` instance. The
first argument is its path. Consider giving all your database paths a specific
prefix ($e.g.$ out) to easily ignore them in version control like git.

```python title="Creating a database"
from bamboost import Manager
db = Manager('./out')
```

This will create the directory and create and assign a unique ID to the new
database, given that the database at `./out` does not already exists.
With the manager available, you can now start adding entries to it.

## Indexing of databases

All bamboost databases are assigned a unique ID with which its data can be
accessed safely.

Accessing existing databases can thus be done without knowledge of its path and
from anywhere on your system. The easiest way is to use `Manager.fromUID[...]`
which provides autocompletion for existing databases. Just start typing the path
or ID if you know it.

```python
db = Manager.fromUID["<ID>"]
```

Alternatively, you can create a Manager directly from its UID:

```python
db = Manager(uid='<ID>')
```

Internally, a sqlite database is maintained to keep track of known bamboost
databases and it's content. However, this serves more as a cache system to speed
up operations. If a requested database is not in the sqlite database, the file
system is searched. To tell bamboost where your data may be, edit the list of
known paths in the config file at `~/.config/bamboost/config.toml`. As long as
your data is in these directories, it will be found.

```toml
[index]
# the list of paths to search for databases
paths = [
    '/home/florez/work/',
    '/home/florez/journal/',
]
```

## Creating a simulation/entry

Each entry to the database is a subdirectory of the database folder with a
single `h5` file inside. To create a new entry, use the `create_simulation`
function.

The function takes the following arguments. All of these are optional.

- uid (`str`): The name/uid for the simulation. If not specified, a random id will
  be assigned.
- parameters (`dict`): Parameter dictionary. If provided, the parameters will be
  checked against the existing sims for duplication. Otherwise, they may be
  specified later with `bamboost.simulation.SimulationWriter.add_parameters`.
- skip_duplicate_check (`bool`): if True, the duplicate check is skipped.
- prefix (`str`): Prefix for the uid. If not specified, no prefix is used.

The function returns a new instance of type `SimulationWriter`, which we can use
to alter the data stored in this simulation, or change its parameters or
metadata.

Parameters are a crucial part of any model. You can provide any number of
parameters as a dictionary. The dictionary can be nested as well.

```python title="Creating a new entry in a database"
parameters = {
    "boat": {
        "E": 1,
        "nu": 0.3,
    },
    "wall": {
        "E": 20,
        "nu": 0.2,
    },
    "penalty_constant": 100,
    "material_model": "Linear elastic",
}
sim = db.create_simulation(parameters=parameters)
```

In general, the creation of this entry should be decoupled from the actual
computation. As thus, the bamboost framework serves as input and output file
at the same time! More on simulation management later.

## Writing data

The bamboost `SimulationWriter` is used to write data during your simulation (or as part of a
postprocessing step after). You can get a SimulationWriter object in one of the
following ways:

- when creating a new entry:
  ```python
  writer = db.create_simulation()
  ```
- accessing an entry of a database with the optional flag `return_writer` set to
  true:
  ```python
  writer = db.sim('<id>', return_writer=True)
  ```
- by using the class directly:
  ```python
  from bamboost import SimulationWriter
  writer = SimulationWriter('<id>', 'path/to/database')
  ```
- by using its unique identifier (the full id is a combination of the database
  ID and the simulation name/id → 'database-ID:sim-ID'):
  ```python
  writer = SimulationWriter.fromUID('<full-id>')
  ```

Bamboost is tailored towards numerical simulations. Hence it supports writing
meshes, and corresponding data for any number of steps, out of the box.
In addition, you can write global data such as the total energy or reaction
forces.

### Meshes

You can add one or multiple meshes. In the case of no mesh name argument, this
refers to the default mesh named *mesh*.
