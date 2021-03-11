function select(input, s, p, o) {
    var returnObject = {};
    var lines = input.split('\n');
    var validLines = [];
    for(var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if(isValidLine(line)) {
            validLines.push(line);
        }
    }
    var groups = groupSubjects(validLines);
    var object = {};
    for(var j = 0; j < groups.length; j++) {
        var group = groups[j];
        var returnSubject = false;
        var poList = [];
        var subject = getGroupSubject(group);
        if(s == null || subject == s) {
            for(var k = 0; k < group.length; k++) {
                var line = group[k];
                var po = getPO(line);
                poList.push(po);
                if((p == null && o == null) || (po.p == p || po.o == o)) {
                    returnSubject = true;
                }
            }
        }
        if(returnSubject) {
            returnObject[subject] = poList;
        }
    }
    return returnObject;
}

function isValidLine(line) {
    return line && line.charAt(0) != '@' && line.charAt(0) != '#'; 
}

function groupSubjects(lines) {
    var groups = [];
    var exploringSubject = false;
    var lastPos = 0;
    for(var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var parts = splitBySpace(line);
        if(isSPOLine(parts)) {
            exploringSubject = true;
            lastPos = i;
            if(isEndOfSubject(parts)) {
                groups.push(lines.slice(i, i+1));
            }
        } else if(isPOLine(parts) && isEndOfSubject(parts)) {
            groups.push(lines.slice(lastPos, i+1));
        }
    }
    return groups;
}

function getGroupSubject(group) {
    return splitBySpace(group[0])[0];
}

function getPO(line) {
    var parts = splitBySpace(line);
    if(isSPOLine(parts)) {
        return {p: parts[1], o: parts[2]};
    } else if(isPOLine(parts)) {
        return {p: parts[0], o: parts[1]};
    }
    return null;
}

function isSPOLine(parts) {
    return parts.length == 4 && (parts[3] == ";" || parts[3] == ".");
}

function isPOLine(parts) {
    return parts.length == 3 && (parts[2] == ";" || parts[2] == ".");
}

function isEndOfSubject(parts) {
    return (parts.length == 3 && parts[2] == ".") || (parts.length == 4 && parts[3] == ".");
}

function splitBySpace(line) {
    var parts = [];
    var enclosedQuotes = false;
    var lastPos = 0;
    for (var i = 0; i <= line.length; i++) {
        if(line.charAt(i) == " " && !enclosedQuotes) {
            parts.push(line.substring(lastPos, i));
            lastPos = i+1;
        }
        if(line.charAt(i) == "\"") {
            enclosedQuotes = !enclosedQuotes;
        }
        if(line.charAt(i) == "\t") {
            lastPos = i+1;
        }
        if(i == line.length) {
            parts.push(line.substring(lastPos, i));
        }
    }
    return parts;
}
