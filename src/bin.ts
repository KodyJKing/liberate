import path from "path"
import fs from "fs"
import * as common from "./common"

const root = "./src"
const indexFileName = "index.ts"

export default function bin() {
    const [ , , cmd ] = process.argv

    const commands = [ "build", "watch" ]
    if ( commands.indexOf( cmd ) == -1 ) {
        console.error( "Unrecognized command." )
        console.error( "Available commands: " + commands.join( ", " ) )
    }

    const watch = cmd == "watch"

    let changed = false
    let filenames = new Set<string>()

    function generateIndex() {
        changed = false
        let files = Array.from( filenames )
            .map(
                ( name, i ) => {
                    let [ path, extension ] = name.replace( "\\", "/" ).split( "." )
                    return { path, extension, symbol: "_" + i }
                }
            ).filter(
                file => file.extension == "ts" && file.path != "index"
            )

        let indent = "    "

        let importsStr = files.map( file => `import * as ${file.symbol} from "./${file.path}"` ).join( "\n" )
        let exportsStr = files.map( file => file.symbol ).join( ",\n" + indent )

        let file = importsStr + "\n\nexport default {\n" + indent + exportsStr + "\n}"

        // console.log( file )

        let outpath = path.join( root, indexFileName )
        fs.writeFileSync( outpath, file, { encoding: "utf8" } )
    }

    function checkFile( filename ) {
        let justChanged = false
        let filepath = path.join( "./src", filename )
        if ( common.exists( filepath ) ) {
            justChanged = !filenames.has( filename )
            filenames.add( filename )
        } else {
            justChanged = filenames.has( filename )
            filenames.delete( filename )
        }
        changed = changed || justChanged
    }

    common.getFilesRecursive( root ).map( filename => checkFile( filename ) )
    generateIndex()

    if ( watch ) {
        fs.watch( root, { recursive: true }, ( eventType, filename ) => {
            filename = filename.toString()
            let isFile = filename.indexOf( "." ) > -1
            if ( isFile ) {
                checkFile( filename )
                if ( changed )
                    generateIndex()
            }
        } )
    }
}