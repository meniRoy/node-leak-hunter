const v8 = require('node:v8'); 

export function writeHeapSnapshot(){
    console.time('writeHeapSnapshot')
    v8.writeHeapSnapshot();
    console.timeEnd('writeHeapSnapshot')

}

export function writeHeapSnapshotWithGC(){
    console.log('run gc')
    global.gc!()
    global.gc!()
    global.gc!()
    writeHeapSnapshot()
}