# camel-konsole

A simple prototype project to be used as a target for discussion about next generation Integration product.

## How to start

You need a kubernetes where `camel-k-operator` is up and running. Launching the application will proxy the kubernetes cluster API to be used locally by a `nodejs` application.

```
./kamel ui
```

At this stage you can launch a browser to http://localhost:3000/

## How to stop

Just execute `CTRL+C` on the ui command shell.
