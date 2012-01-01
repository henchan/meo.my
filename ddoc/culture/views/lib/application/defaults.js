exports.CULTURE = 'http://127.0.0.1:5984/myCulture';  /* this culture. (value is substituted upon ddoc creation) */

exports.SYS_PARAMS = {
    DEF_ENC : 'unsignedInt32',
    ENC_BITS : 5,
    MIN_BREADTH : 8,
    MAX_BREADTH : 10,
    DEF_BREADTH : 8,
    MAX_SNIPS : 64, /* the maximum number of highly Selective Pos (SniPs) to use for x,y,z calculation. Should be an even number */
    MIN_SNIPS : 8, /* minimum snips */
    DEF_SNIPS : 16, /* default snips */
    MAX_32BITINT : 4294967295  /* 32-bit limit (js bitwise operators)  */
};
