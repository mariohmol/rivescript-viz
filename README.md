# rivescript-viz

This is Admin UI for your rivescript chatbot project. We are using here `node`, `express`, `angular`, `d3` and other modules to create a full adminstrative page.

To install fork this project, run `npm install` and `npm .`.

This project was made using separated server/client side, so you can include this in your project as it is. To use this project, copy your `.rive` files into `/aiml/ ` folder.

![Admin GUI](/public/page.png)

## Rive

In this page you have a spreadsheet that loads all `.rive` files inside `aiml` folder. So you can change, add and remove rules. After all you can save changes back again in your rive files. In that way you can give to your team a place to easily manage the bot brain.

![Rive editor](/public/rive.png)

## Interview Chat

TODO

## Interview Results

In interview chat mode the bot will ask you questions and then when you reach the final of a flow, it will give you a page showing some text and results.
The interview results page you have a HTML editor where you can create those files and contents.

![Interview results](/public/interviewresults.png)

## Chat

TODO



## Graphs

This chart we look every topic and connect them using the reply, here a code example where a topic `interview1` is connected to `interview2`:

```rive
> topic interview1
	+ *
	- Hi there! My name is <bot name>. What's your name?
	^ <set retry=0>{topic=interview2}
< topic
```

Here is a example of chart using as example `begin.rive` from `rivescript` repository. The size of nodes is based on connections numbers, so nodes that are important shows more and nodes that are at the end of the flow will be smaller.

![Network Example](/public/graphs.png)

Connection between nodes now has a label that shows the trigger that connect them.

![Connections Example](/public/nodes.png)

## TODO

* Interview chatbot
* Normal Chat
* Interview results: create a example in rive scripts, using user bot vars and document in readme
* Save rive changes in file
