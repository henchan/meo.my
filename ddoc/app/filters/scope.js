function (doc, req) {
/*
    Retrieve all cTags in the culture except those not within the specified range from the specified focus cTag.
    Range is specified in bits of dissimilarity (expressed as an array for breadth = [8, 9])
    The specified cTag focus does not need to be present in the culture.
    cTags must be encoded as an array of 32 bit ints
    Only breadths 8 and 9  are supported. This can be increased when entropy tables are available for 1024 bits and higher.
*/
// curl -X GET 'http://127.0.0.1:5984/scope/_changes?filter=scope/scope&include_docs=true&json=\{"parameter":\{"encoding":"unsignedInt32"\},"focus":\{"contents":\[801230700,355309458,3424033142,2223922514,32299824,1274282124,1293468314,3604237240,2547180548,3040791058,2766510020,2230429348,58706658,1550216502,1008734536,1853044246\]\},"range":\{"bits":\{"lower":\[0,0\],"upper":\[123,249\]\}\}\}'

    if ( doc.contents )
    { 
        var req = req || {}; req.query = req.query || {}; req.query.json = req.query.json || "{}";
        var DEF_ENC = "unsignedInt32",  ENC_BITS = 5,   
        MIN_BREADTH = 8, MAX_BREADTH = 9, DEF_BREADTH = 8,
        DEF_BITS_UPPER = { "bits" : {"upper" : [120,250]}}, // range array starts at MIN_BREADTH
        DEF_BITS_LOWER = [0,0],
        MAX_32BITINT = 4294967295,   // 32-bit limit (js bitwise operators)     
        dataObj = JSON.parse(req.query.json), focus, p, encoding, breadth, range, i, j, lowLength, norm=0;
        range = dataObj.range || DEF_BITS_UPPER;
    	focus = dataObj.focus || {}; 
        focus.contents = focus.contents || [4294967295,4294967295,4294967295,4294967295,4294967295,4294967295,4294967295,4294967295];
        if (focus ) // required parameters
        {
            p = dataObj.parameter || null;
            encoding = (p && p.encoding) || DEF_ENC;
            lowLength = focus.contents.length  < doc.contents.length ? focus.contents.length : doc.contents.length;
            breadth = MIN_BREADTH + ( lowLength >> (MIN_BREADTH - ENC_BITS) ) -1;
            breadth = breadth > MAX_BREADTH ? MAX_BREADTH : breadth;
            if (encoding == DEF_ENC) { // currently only unsignedInt32 is supported 
                var bitSum256 = [ // e.g. 159 = 10011111 (1+0+0+1+1+1+1+1 = 6) --> bitSum256[159] = 6
                    0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,
                    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
                    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
                    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
                    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
                    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
                    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
                    3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8
                ],
                length = Math.pow(2,breadth),
                ints = length >> ENC_BITS, focContInt, bitMatches = 0,
                focContArr = focus.contents, docContArr = doc.contents, docContInt, focSeg, docSeg;
                if (focContArr.length < ints) { return false; }
                
                // 32 bits per int
                for (i=0; i<ints; i++) {
                    docContInt = docContArr[i]; focContInt = focContArr[i] + 0; // cast to number   
                    if (focContInt < 0 || focContInt > MAX_32BITINT) { return false; } 
                    // 4 * 8-bit segments in an integer
                    for (j=0; j < 4; j++) { // [0] is the least significant 8 bits
                        focSeg = (focContInt >> (MIN_BREADTH * j)) & 255; 
                        docSeg = (docContInt >> (MIN_BREADTH * j)) & 255; 
                        bitMatches += bitSum256[(~(focSeg ^ docSeg)) & 255]; // not XOr
                    }                   
                }
                bitMatches = bitMatches > length / 2 ? length - bitMatches : bitMatches; // reversal
                norm = breadth-MIN_BREADTH;
                if (bitMatches <= range.bits.upper[norm] &&
                    (bitMatches >= ((range.bits.lower && range.bits.lower[norm]) || DEF_BITS_LOWER[norm])))
                {
                    return true; // a real live one, yeah
                }
                else { return false; }
			}
			else { return false; }
		}
		else { return false; }
	}
	else { return false; }
}