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

Here is a example of chart using as example `begin.rive` from `rivescript` repository.

![Network Example](/public/example.png)

## TODO

* Make nodes in topic network increase the size considering how many childrens it has
* Create others Visualisations
