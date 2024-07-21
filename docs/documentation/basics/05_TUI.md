# Terminal user interface

## Configuration

The TUI can be configured using the configuration file at
`~/.config/bamboost/tui.toml`.

```yaml title='Example configuration file'
theme = "default"  # or "highlight"

# Keybindings
[keybinds]
custom_files = [
    "/home/florez/.config/bamboost/functions.py",
]

[keybinds.database]
command = ":"
search = ","
jump = "/"
help = "?"
copy = "y"
open-paraview = "ctrl o"
open-xdmf-file = ["o", "x"]
open-output-file = ["o", "o"]
open-submission-file = ["o", "e"]
open-dir = ["o", "d"]
submit = [" ", "s"]
delete = "d"
note = ["o", "n"]
links = "L"
stdout = "ctrl t"
reload = "R"
page-down = "ctrl d"
page-up = "ctrl u"
next-search = "n"

# custom functions: table with key and function name
# the functions must take 2 arguments: size, key
plot = { key = "ctrl k", func = "show_plot" }
myjobs = { key = ["o", "m"], func = "show_job" }
cancel-job = { key = "C", func = "cancel_slurm_job" }
dummy = { key = ["m", "m"], func = "dummy_function" }
```
