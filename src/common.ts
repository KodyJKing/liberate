import * as fs from "fs"
import * as path from "path"

export function exists( file: string ) {
    try {
        return fs.statSync( file ) != null
    } catch ( e ) {
        return false
    }
}

export function isFile( file: string ) {
    let stats = fs.statSync( file )
    return stats && stats.isFile()
}

export function isDirectory( file: string ) {
    let stats = fs.statSync( file )
    return stats && stats.isDirectory()
}

export function getFilesRecursive( root = __dirname, directory = root, files: string[] = [] ) {
    for ( let name of fs.readdirSync( directory ) ) {
        let fullname = path.join( directory, name )
        let stats = fs.statSync( fullname )
        if ( stats.isFile() ) {
            let relative = path.relative( root, fullname )
            files.push( relative )
        } else if ( stats.isDirectory() ) {
            getFilesRecursive( root, fullname, files )
        }
    }
    return files
}