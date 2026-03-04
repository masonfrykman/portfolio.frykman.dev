import subprocess
import sys
import os
from shutil import rmtree, copytree, copyfile

if(os.path.exists("build.conf") == False):
    print("Error: build.conf is missing.")
    raise SystemExit(1)

# MARK: Get file instructions

bf_minify = []
bf_copy = []
rootdir = "src/"
outdir = "dist/"

with open("build.conf", "r") as buildfile:
    for line in buildfile.readlines():
        line = line.strip()
        
        # skip comments & empty lines
        if(line.startswith(("//", "#", ";")) or len(line) == 0):
            continue

        line_args = line.split(" ")
        if(len(line_args) < 3):
            print(f"WARN: Invalid line definition '{line}'.")
            continue

        if(line_args[0] == "minify"):
            bf_minify.append((line_args[1], line_args[2]))
        elif(line_args[0] == "copy"):
            bf_copy.append((line_args[1], line_args[2]))
        elif(line_args[0] == "root"):
            rootdir = line_args[2]
        elif(line_args[0] == "output"):
            outdir = line_args[2]
        else:
            print(f"WARN: Invalid line definition '{line}'.")

if(len(bf_copy) == 0 and len(bf_minify) == 0):
    print("Nothing to do (build.conf has no valid declarations).")
    raise SystemExit

# Clear build directories
rmtree("dist", ignore_errors=True)
rmtree("build", ignore_errors=True) # created by tsc
os.mkdir("dist")

# MARK: Compile typescript
print("Compiling & bundling typescript")
print("\t> tsc -> build/")
tsc = subprocess.run(["npx", "tsc"])
if(tsc.returncode != 0):
    print(f"\t\tERROR: tsc returned a non-zero exit code ({tsc.returncode}).")
    raise SystemExit(2)

print("\t> rollup")
rollup = subprocess.run(["npx", "rollup", "build/index.js", "--file=build/bundle.js", "--format=es"])
if(rollup.returncode != 0):
    print(f"\t\tERROR: rollup returned a non-zero exit code ({rollup.returncode}).")
    raise SystemExit(2)

print("\t> minify")
min_ts = subprocess.run(["npx", "minify", "build/bundle.js"], text=True)
if(min_ts.stdout.startswith("Error:")):
    print("\t\tERROR: minify failed to minify build/bundle.js.")
    print(f"\t\t\tStdout: ${min_ts.stdout}")
    raise SystemExit(2)

print("SUCCESS: Compiling & bundling typescript")

# MARK: Copy assets
print("Copying assets as defined in build.conf")

# copy
for copy_defs in bf_copy:
    filename = rootdir + copy_defs[1]

    # check it exists.
    if(os.path.exists(copy_defs[1]) == False):
        print(f"\tWARN: Not copying {copy_defs[1]} as it does not exist.")
        continue

    # copy it
    if(copy_defs[0] == "file"):
        copyfile(filename, outdir + copy_defs[1])
    elif(copy_defs[0] == "directory"):
        copytree(filename, outdir + copy_defs[1])
    else:
        print(f"\tWARN: Invalid type '{copy_defs[0]}' for '{copy_defs[1]}'.")

# minify
for min_defs in bf_minify:
    filename = rootdir + copy_defs[1]

    # check it exists
    if(os.path.exists(copy_defs[1]) == False):
        print(f"\tWARN: Not minifying {copy_defs[1]} as it does not exist.")
        continue

    # run thru minify
    # TODO: finish this function for file and directory types.