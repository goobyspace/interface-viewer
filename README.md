# Interface Viewer

This website is essentially a file explorer for the github repo [goobyspace/interface](https://github.com/goobyspace/Interface) that contains the WoW interface files.

# How to update to new patch:
- Export the interface art with the `ExportInterfaceFiles art` command. Check out [Warcraft Wiki](https://warcraft.wiki.gg/wiki/Viewing_Blizzard%27s_interface_code) for more details.
- Use [BLPC](https://www.wowinterface.com/downloads/info18810-Blpc.html) to batch convert the files to .PNG
- Push the new .PNGs to Github
- Use the `script.js` file & package.json found in the `/script` folder inside of the interface repo to create an index.json file of all the art in the repo (Using the `npm start` command, for more info check out node & NPM)
- Put the index.json file in `src/assets`
- Build and publish