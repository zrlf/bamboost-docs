---
title: Installation troubleshooting
---

import './styles.scss';

The requirements for the bamboost library are: `h5py`, `mpi4py`, `numpy`, `pandas`.

### MPI

The `mpi4py` package requires a working MPI installation on the system. If the installation fails, it is likely that the MPI library is not installed.


<div className="help-box">
#### Ubuntu/Debian

```bash
sudo apt install libopenmpi-dev
```

#### Fedora

```bash
sudo dnf install openmpi-devel
```

<details className="drawer">
<summary>Known issues on Fedora</summary>

The installation can fail because of mpi4py resulting in the following error
``` bash
ERROR: Failed building wheel for mpi4py
```
arising because the `mpi.h` header files are not found.

Proper installation of `mpi4py` can be achiedved by installing openmpi-devel and loading the mpi/openmpi module before pip-installing `mpi4py`.
```bash
sudo dnf install openmpi-devel (on Fedora)
source /etc/profile.d/modules.sh 
module load mpi/openmpi
```
Now, `pip install mpi4py` should work without errors.

</details>

#### Arch

```bash
sudo pacman -S openmpi
```
</div>


---

### HDF5

The `h5py` package requires the HDF5 library to be installed on the system. If the installation fails, it is likely that the HDF5 library is not installed.

<div className="help-box">
#### Ubuntu/Debian

```bash
sudo apt install libhdf5-openmpi-dev
```

#### Fedora

```bash
sudo dnf install hdf5-openmpi-devel
```

#### Arch

```bash
sudo pacman -S hdf5-openmpi
```
</div>

---

### Installation in editable mode

Bamboost can be installed in editable mode with 

```bash
git clone git@gitlab.com:cmbm-ethz/bamboost.git
cd bamboost
pip install -e .
```

Sometimes, bamboost hangs on import, i.e., `from bamboost import manager`results in `(unknown location)`.
In this case you can try
```bash
pip install -e . --config-settings editable_mode=compat
```
which should fix the error.


---

### Python version management

[pyenv](https://stribny.name/blog/install-python-dev/) is a useful tool to manage development versions of python.

```bash
pyenv install --list # lists available versions
pyenv install 3.8-dev # installs python 3.8-dev
pyenv install 3.12.1 # installs python 3.12.1
pyenv global 3.12.1 # sets the global version
pyenv local 3.8-dev # sets the local version
```
