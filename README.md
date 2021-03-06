# ts-loader-watchapitest
A repository to test performance with experimentalWatchApi.

In order to test the performance a large codebase with many files is needed.  The generate.ts script populates src/generated with many files to give the compiler a workout.

The code here was developed in WSL2. It will work in Windows Powershell but you will have to change the scripts in package.json to remove 'time' and '-p' from the install script.

## Installation

```
yarn install
yarn generate
```

<code>generate</code> creates source code in src/generated.  You can modify generate.ts to control the number of files, depth of nesting and the amount of code in each file.

Initially the settings for <code>generate.ts</code> are:
```
const depths = [4,4,4,4,4];
const busyWork = 0;
```

This means the generated code will have 5 levels of nesting with 4 files at each level.  <code>busyWork</code> can be changed to include extra padding code in each file to increase the work for the compiler.

A build can then be run with:
```
yarn build
```

Webpack.config is set to build in development mode with <code>watch</code> set to <code>false</code>. (Using production mode extends the time for all runs by including minification and other post processing).  On my system (WSL2 on an i7-3770 at 3.4 GHz ) I saw the following times, averaged over 5 runs:

```
transpileOnly:                                  8.5s
transpileOnly + ForkTsCheckerWebpackPlugin:     9.0s
normal:                                        14.8s
experimentalWatchApi:                          21.0s
```

Currently transpileOnly and fork-ts-checker-webpack-plugin are the recommended solution for improving performance on large projects so expermentalWatchApi is incurring a 2x slowdown in the initial build.

I believe the expermentalWatchApi is meant to reduce build time when projects are in watch mode, so perhaps it does not matter if the performance is not improved for production builds. To test performance in watch mode I set <code>watch</code> to <code>true</code> in webpack-config and timed the initial build and incremental build after changing 1 file:
```
                       Initial Build   Incremental Build
normal:                   15.0s             <1.0s
experimentalWatchApi:     22.4s              6.0s
```

I believe the incremental build time is very short because webpack in watch mode only builds files which need to be rebuilt.  This is the same reason the watchApi was created so I wonder if it is necessary to use it in a webpack loader if that function is already handled by webpack.

Building the project with plain <code>tsc -b</code> I get the following times:
```
Initial Build:  7.5s
Repeat Build:   0.4s
After 1 change: 2.8s
```





