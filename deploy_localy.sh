#!/bin/bash

rollup -c;

generated_dir="$(dirname $(realpath $0))/dist";

# from WSL to Windows
path_to_screeps="/mnt/c/Users/130/AppData/Local/Screeps/scripts/screeps.com";

screeps_branch_name="screeps-common-sense-ts";

mkdir -p "$path_to_screeps/$screeps_branch_name";

echo "$generated_dir" "->" "$path_to_screeps/$screeps_branch_name/";

cp $generated_dir/*.js "$path_to_screeps/$screeps_branch_name/";
