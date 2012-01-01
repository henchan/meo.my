var 
    // probabilities are pre-calculated with binomial distribution (8 >= breadth <= 9). 
    rangeTab = require('views/lib/data/range').rangeTab,
    
    // approximate probabilities are calculated using normal distribution (10 >= breadth <= 15). 
    normalcdf = function(hits, length) { //HASTINGS.  MAX ERROR = .000001
    var 
        X = (hits + 1 - length * 0.5) / Math.sqrt(length * 0.25),
        T = 1 / (1 + .2316419 * Math.abs(X)),
        D = .3989423 * Math.exp(-X * X / 2),
        Prob = D * T * (.3193815 + T * (-.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
        if (X > 0) {
            Prob = 1 - Prob
        }
        return Prob;
    },
    
    logBase2 = function(n) {
        return Math.log(n) / Math.LN2;
    },
    
    entropy = function(P) {
        return -(P * logBase2(P) + (1 - P) * logBase2(1 - P));
    },
    
    range = function(hits, breadth) {
        
        if (hits == Math.pow(2, breadth-1)-1) {
            return "Infinity";
        }
        if (breadth == 8 || breadth == 9) {
            return rangeTab[breadth-8][hits];
        }
        else {
            var length = Math.pow(2, breadth),
                cumP = normalcdf(hits, length),
                ent = entropy(cumP);
            return -1 / logBase2(ent) || 0;
        }
    };
exports.range = range;