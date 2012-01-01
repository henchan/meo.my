/*
    byOffsets list
    
        curl -H "Content-Type: application/json" -d '{"keys":["\udbb3\udf1e\udb8c\udce32","\udb80\udc00\udbff\udfc40",">0B1*H6q<",">0B1*Ey8<"]}' -X POST http://127.0.0.1:5984/dev/_design/culture/_list/byOffsets/cluster?include_docs=false&snips=12
*/

function(head, req) {
    
    var getSnips = function (path) {
        var  qryArr, snipsStr, 
        query=path[path.length-1]; // TODO verify query must be last
        if (query) {
            qryArr = query.split("snips=");
            if (qryArr.length > 1) {
                snipsStr = qryArr[qryArr.length-1];
                return parseInt(snipsStr.split("&")[0]);
            }
        }
        return false;
    };
     
    var  by  = require('views/lib/func/sort').by, 
    appDef   = require('views/lib/application/defaults').SYS_PARAMS,
    path    = req.requested_path, snips, 
    posArr = [], posObj = {}, idObj = {}, resObj = {},  row, 
    id, pos, offset, i, posCount=0, posPerId, idCount=0,
    MAX_POS = 16;
    
    snips = getSnips(path);
    if (snips) {
        snips = snips < appDef.MIN_SNIPS ? appDef.MIN_SNIPS : 
            (snips > appDef.MAX_SNIPS ? appDef.MAX_SNIPS : snips);
    }
    else {snips = appDef.DEF_SNIPS;}
    
    while (row = getRow() ) 
    {   
        id = row.key;
        if (!idObj[id]) {
            idCount++;
            idObj[id] = true;
        }
        posArr.push( {id : id, pos : row.value[0], offset : row.value[1]} );            
    }
    posArr.sort(by('offset'));   
    
    idObj = {}; 
    posPerId = Math.ceil(snips / idCount);
    for (i=0;i<posArr.length;i++) {
        id = posArr[i]['id']; pos = posArr[i]['pos']; offset = posArr[i]['offset'];
        idObj[id] = idObj[id]++ || 0;                
        
        if (posObj[pos]) {
            posObj[pos].push({id : id, offset : offset});
        } else {
            if (posCount < snips) {
                if (idObj[id] < posPerId) {
                    posObj[pos] = [{id : id, offset : offset}];
                    posCount++;
                }
            }     
        }
    }
    
    var cTag3D = require('lib/cTag3D').cTag3D      ;   
    cTag3D(posObj, snips);

}