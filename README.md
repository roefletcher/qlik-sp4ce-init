# qlik-sp4ce-init

the init node serveur for sp4ce vms
this is manly a wrapper for initialization modules

- [whitelist] (https://github.com/pouc/qlik-sp4ce-init-whitelist)

put init modules in the init folder (must be created at the root of this project after npm install)

# How to

## To start the init

```
http://<host>:11337/init?<params>
```

This returns a Task object (see https://github.com/pouc/qlik-utils) (long poll)

Parameters are described in their respective modules

## To get the task status

```
http://<host>:11337/getProgress?guid=<guid>
```

This returns a Task object (long poll)