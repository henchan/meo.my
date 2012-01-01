/*
    cTag3D.js
    This funtion is used to plot the clock snipition of cTags in a scope. 
    snipObj is an object: {'31' : [{id: "00b3", offset : 39}, {id: "999f", offset : 1}], '255' : [{id: "00b3", offset : 5}, {id: "999f", offset : 12}]}
        snipCount==2
    It returns x,y,z.
*/

exports.cTag3D = function(snipObj, snipCount) {
    
    var 
        callibrateRange = require('lib/3D').callibrateRange,         
        pointsOnSphere   = require('lib/3D').pointsOnSphere,
        snip, pts, snipNum=0, id, offset, ptsArr=[], snipArr=[], idObj={}, resArr=[],
        DEF_RANGE = 1;
    
    // Every requested snip is a point on a sphere (radius=1). 
    ptsArr = pointsOnSphere(snipCount); 

    for (snip in snipObj) {
        pts = ptsArr[snipNum++];
        snipArr = snipObj[snip];
        for (j=0; j < snipArr.length; j++) {
            id      = snipArr[j]['id'];
            offset  = snipArr[j]['offset'] || 1;   
            idObj[id]    = idObj[id] || {offset : offset, x:0, y:0, z:0};
            idObj[id].x += pts.x * Math.log(offset);
            idObj[id].y += pts.y * Math.log(offset);
            idObj[id].z += pts.z * Math.log(offset);
            
            if (snipNum == snipCount - 1) {
                resArr.push(
                        callibrateRange (
                            id,
                            idObj[id].x,
                            idObj[id].y,
                            idObj[id].z,
                            DEF_RANGE
                        )
                );    
            }
        }
    }
    send ( JSON.stringify ( resArr ));
}