import * as fs from "fs";
import * as path from "path";

export function log( message: string ) {
    console.log( `\x1b[36m${message}\x1b[0m` )
}

export function exists( file: string ) {
    try {
        return fs.statSync( file ) != null
    } catch ( e ) {
        return false
    }
}

export function readBuffer( file: string ): Buffer | null {
    if ( !exists( file ) )
        return null
    return fs.readFileSync( file )
}

export function read( file: string ): string | null {
    let buffer = readBuffer( file )
    return buffer != null ? buffer.toString() : null
}

export function isFile( file: string ) {
    let stats = fs.statSync( file )
    return stats && stats.isFile()
}

export function isDirectory( file: string ) {
    let stats = fs.statSync( file )
    return stats && stats.isDirectory()
}

function getFilesRecursiveInternal( root = __dirname, directory = root, files: string[] = [] ) {
    for ( let name of fs.readdirSync( directory ) ) {
        let fullname = path.join( directory, name )
        let stats = fs.statSync( fullname )
        if ( stats.isFile() ) {
            let relative = path.relative( root, fullname )
            files.push( relative )
        } else if ( stats.isDirectory() ) {
            getFilesRecursiveInternal( root, fullname, files )
        }
    }
    return files
}

export function getFilesRecursive( root = __dirname ) {
    return getFilesRecursiveInternal( root )
}