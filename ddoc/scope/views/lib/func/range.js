var scopeRange = function(doc, CULTURE, FOC_CONTS, FOC_RANGE, isView) {
    /* 
    This function is shared by the range view and range filter
    If a cTag doc is within the maximum specified range from the focus:
        - it emits range from the focus (view)
        - or returns true (filter)
    When called from the view, it also emits segment data which is used for clustering.
    cTag contents must be encoded as an array of 32 bit ints
     */
    if( doc.culture && doc.culture == CULTURE) {
        var appDef = require('views/lib/application/defaults').SYS_PARAMS;
         if(doc.contents && doc.contents.length >= appDef.MIN_BREADTH) {
        	var
			focus = {
				contents : FOC_CONTS,
				range : FOC_RANGE
			}, breadth, length, range, i, j, focContInt, focContArr, ints, lowLength, docContInt, 
            bitHits=0, reversal=false, missBinStr, missBinStrArr=[];
			lowLength = focus.contents.length < doc.contents.length ? focus.contents.length : doc.contents.length;
			breadth = appDef.MIN_BREADTH + (lowLength >> (appDef.MIN_BREADTH - appDef.ENC_BITS) ) - 1;
			breadth = breadth > appDef.MAX_BREADTH ? appDef.MAX_BREADTH : breadth;
			length = Math.floor(Math.pow(2, breadth));
			ints = length >> appDef.ENC_BITS;
			focContArr = focus.contents;

 			if(focContArr.length < ints) { return false; }
			for( i = 0; i < ints; i++) { // 32 bits per int
				docContInt = doc.contents[i];
				focContInt = focContArr[i] + 0; // cast to number
				if(focContInt < 0 || focContInt > appDef.MAX_32BITINT) {
					return false;
				}
                missBinStr = (focContInt ^ docContInt).toString(2);            
                while (missBinStr.length < 32) {missBinStr = "0" + missBinStr;} // left pad (ints had no leading zeros)                
                missBinStrArr[i] = missBinStr;
                bitHits += missBinStr.split("0").length - 1;                
			}
            if (bitHits > length / 2) {
                bitHits = length - bitHits;
                reversal = true;
            }
			if(bitHits <= FOC_RANGE) {
                if (isView) { 
        	    	emit(Math.pow(2,breadth-1)+bitHits);
//    		    	emit([breadth,bitHits]);
                }
                else { // we are a filter
                    return true;
                }
			}
		}
	}
};
exports.scopeRange = scopeRange;