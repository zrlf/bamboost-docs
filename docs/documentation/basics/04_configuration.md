# Configuration

Bamboost can be configured using the configuration file at
`~/.config/bamboost/config.toml`.

```yaml title='Example configuration file'
[options]
# uncomment to disable mpi support
mpi = true

# default column to sort dataframes by
sort_table_key = 'time_stamp'
sort_table_order = 'desc'  # or 'asc'

# sync database tables with sqlite database on the fly
sync_tables = true

[index]
# the list of paths to search for databases
paths = [
    '/home/florez/work/',
    '/home/florez/journal/',
]
```
