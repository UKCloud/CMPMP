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
- GUI to perform all actions commands can do
    - Add/Edit/Delete files
    - Add/Edit/Delete folders
    - Edit Vaunch configuration
    - Import/Export Vaunch configuration     

## Usage

While using Vaunch, to get help on any of the available commands, just type `help` in the input box, or find the `help` command in the Commands window. The help window will list all available commands with a description, their available parameters, and some examples of using the command.

On Vaunch's first start, there will be no files or folders created.

To create a new folder:
- With commands: Run `mkdir folder_name`
    - To set the icon of the folder, run `set-icon folder_name new_icon_name`
- With the GUI: Right click on an empty space and click "Add Folder"
    - The name, and icon can then be set in the "New Folder" window

To create a new file:
- With commands: Run `touch folder_name/file_name.lnk siteName.tld/path`
    - To set the icon of the file, run `set-icon folder_name/file_name.lnk new_icon_name`
    - To set the description of the file, run `set-description folder_name/file_name.lnk New Description`
- With the GUI: Right click on an empty space within a folder and click "Add File"
    - Choose the type of file to create, and set the name, prefix (if a Query file), and destination for the file
    - The file icon and description can also be set

Note: When using the GUI to create/edit files and folders all spaces in file/folder names will be converted to underscores, and will be set to lower case.
By default Vaunch changes the display name of files/folders, replacing underscores with spaces, and converting the name to Upper Camel Case.

## Setting Up

Vaunch is written in Typescript, and uses Vue 3 (with Vite) as its framework. To install all dependencies for Vaunch, clone this repo and run `npm i` within the root directory.

Run `npm run setup` to add Font Awesome's CSS.

To run a development instance, run `npm run dev`, or `vite`.

Building vaunch into `dist/` can be done with `npm run build` or `vue-tsc --noEmit && vite build`

After Vaunch has been built, it can be served with any static HTTP server poitned at Vaunch's `dist/` directory, such as [NGINX](https://www.nginx.com/), [HAProxy](http://www.haproxy.org/), [Apache](https://httpd.apache.org/) , or any node-based static site server, like [Serve](https://www.npmjs.com/package/serve).