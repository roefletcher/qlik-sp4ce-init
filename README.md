# qlik-sp4ce-init
the init process for sp4ce vms

# Adds external ip to whitelist

Call :

```
http://<host>:11337/init?cert=<path to cert>&host=<ip/host name that node can use to reach the REST API>&ip=<ip/host name to add into the whitelist>
```
