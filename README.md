# BourneLoader
Cool Interface Loader like something off of Bourne Identity's Spy UIs

Example is in demo/index.html

Library is in dist folder in the JS and CSS folders

## Step 1

### In HTML, import JS and CSS libs:


```html

	<!-- Bourne Loader CSS -->
	<link rel="stylesheet" href="../dist/css/bourneloader.css">
	<!-- Bourne Loader JS -->
	<script src='../dist/js/bourneloader.js'></script>

```

## Step 2

### In Javascript, after importing the above:

```javascript

	var loader = new BourneLoader();
	loader.preloadMsgs(["loading this", "loading that", "something else"], 2);
	loader.postLoadMsgs({"top":["Title of that user is looking at", "Simple instuction"], "bottom":["Some info about what user is looking at", "Some other info that comes after that", "the final message that sticks"], "speed":2});

```

That's it. The .type jQuery method was created in this lib and might be its own lib soon.




