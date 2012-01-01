exports.pointsOnSphere = function (N) {
    /* Pack N points on a sphere's surface using the 'golden-sector' method.
        Radius = 1
    */
        var pts = [],
        inc = Math.PI * (3 - Math.sqrt(5)),
        off = 2 / N,
        i, r, phi, x, y, z;
 
        for (i=0; i<N; i++) {
            y = i * off - 1 + (off / 2);
            r = Math.sqrt(1 - y*y);
            phi = i * inc;            
            pts.push({"x": Math.cos(phi)*r, "y" : y, "z" : Math.sin(phi)*r});
        }
        return(pts);
}   

exports.callibrateRange = function (id, x, y, z, range) {
    // A cTag's cluster position is the geographic mid-point of all its 'active' (i.e. non-matching) snips' points    
    // Geographic mid-point is likely inside or outside the sphere. So project it onto a sphere's surface, callibrated for range.
    var range = range || 1;
        callib = (1/range) * Math.sqrt((Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2)));
    return {"id": id, "point" : {"x" : x / callib, "y" : y / callib, "z" : z / callib}, "range" : range};
}

