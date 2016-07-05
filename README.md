# rivescript-viz

Visualisations using .rive files for rivescript chatbot projects.

To use this project, copy your `.rive` files into `/aiml/ ` folder and then run using `npm run start`.


## Topic Network

This chart we look every topic and connect them using the reply, here a code example where a topic `interview1` is connected to `interview2`:

```rive
> topic interview1
	+ *
	- Hi there! My name is <bot name>. What's your name?
	^ <set retry=0>{topic=interview2}
< topic
```

Here is a example of chart using as example `begin.rive` from `rivescript` repository. The size of nodes is based on connections numbers, so nodes that are important shows more and nodes that are at the end of the flow will be smaller.

![Network Example](/public/example.png)

Connection between nodes now has a label that shows the trigger that connect them.

![Connections Example](/public/nodes.png)

## TODO

* Create others Visualisations
