<h1><img src="public/favicon.svg" width="25" height="25"> Vaunch</h1>

A command-driven, customisable start-page.

Vaunch can be accessed at: https://vaunch.kirimson.com, or you can host it yourself. See [Setting Up](#setting-up) for more information on how to self-host Vaunch

## Features

- Folders to organise your links however you want
- Linux-esc commands to interact with Vaunch
- 'Link' files to go to a specified site, like a bookmark
- 'Query' files to go to customised URLs based on your input, e.g using a search engine, or navigating to a specific Github repository
- Customisable:
    - Icons for both files and folders can be set, using the free [Font Awesome](https://fontawesome.com/) icon set
    - GUI elements can be hidden, for more minimalist design 
    - Can change the window, text, and text-highlight colour
- Everything is local
    - All data is stored locally in your browser's Local Storage. None of your configuration is stored on a remote server.
    - Your config can be exported, shared, edited, and imported easily
- Fuzzy search to quickly find and go to/search commonly used sites
- Tab completion to quickly execute commands and files
- Built in documentation, just run `help` or `man` to get help on all commands available in Vaunch
- GUI to edit files, right click on an existing file and click edit to customise anything in the file from the GUI

## Usage

While using Vaunch, to get help on any of the available commands, just type `help` in the input box, or find the `help` command in the Commands window. The help window will list all available commands with a description, their available parameters, and some examples of using the command.

On Vaunch's first start, there will be no files or folders created. To make one, just type `mkdir folderName` to create a folder, and `touch folderName/fileName.lnk siteName.tld/path` to create a Link file going to any website. (More information on `mkdir` and `touch` can be found on Vaunch's Help window)

## Setting Up

Vaunch is written in Typescript, and uses Vue 3 (with Vite) as its framework. To install all dependencies for Vaunch, clone this repo and run `npm i` within the root directory.

Font Awesome's CSS also needs to be added into `src/assets/fontawesome/`, see [Host Font Awesome Yourself](https://fontawesome.com/v5/docs/web/setup/host-font-awesome-yourself) for any details.

To run a development instance, run `npm run dev`, or `vite`.

Building vaunch into `dist/` can be done with `npm run build` or `vue-tsc --noEmit && vite build`

After Vaunch has been built, it can be served with any static HTTP server poitned at Vaunch's `dist/` directory, such as [NGINX](https://www.nginx.com/), [HAProxy](http://www.haproxy.org/), [Apache](https://httpd.apache.org/) , or any node-based static site server, like [Serve](https://www.npmjs.com/package/serve).