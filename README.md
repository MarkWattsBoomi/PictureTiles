![alt text](https://github.com/MarkWattsBoomi/PictureTiles/blob/main/example.png)

This module contains a component which allows display of a clickable grid of tiles each with a picture, title, sub-title, more-info link button.

The latest version can be included in your player from this location: -

```
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/pictile.js
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/pictile.css
```


## Functionality

The component uses it's model data to draw a paginated grid of tiles where you specify the max per page.

Each tile has a number of elements which you can define their field mappings to the model via attributes.

The image & link can have their uri explicitly set , set under a base uri or default to assume it's in the current tenant's assets folder.

Clicking the link ( more info button ) opens the link in a new tab.

Clicking the tile saves the selected model item to the state and triggers an outcopme called "onClick"



## Component Settings

width and height if specified control the component's dimensions - in pixels.
height is needed !!!


## Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value

### MaxItemsPerPage
The maximum tiles on a page, causes extra tiles to be paginated.

### BaseLinkUri
The uri to pre-pend to the value of the tile's "LinkAttribute" value if it doesn't start with "http".
If ommitted then if the link has no "http" at the start it assumes the current tenant's assets folder path.

### BaseLogoUri
The uri to pre-pend to the value of the tile's "LogoAttribute" value if it doesn't start with "http".
If ommitted then if the link has no "http" at the start it assumes the current tenant's assets folder path.

### HideFooter
"true" | "false" , defaults to "false".
If "true" hides the whole link button part of the tile.

### HideLogo
"true" | "false" , defaults to "false".
If "true" hides the whole logo image part of the tile.

### ButtonLabel
The text to show on the footer button.
Defaults to "Show More".

### RequiresLink
"true" | "false" , defaults to "false".
If "true" hides any tile which has an empty link value.

### TitleAttribute
The name of the model attribute containing the tile's title.

### ContentAttribute
The name of the model attribute containing the tile's body text content.

### LogoAttribute
The name of the model attribute containing the tile's picture / logo url.

### LinkAttribute
The name of the model attribute containing the tile's link / read more link url.


## Outcomes

Each button when clicked will trigger an outcome named exactly "onClick" setting the state to the selected list item.










