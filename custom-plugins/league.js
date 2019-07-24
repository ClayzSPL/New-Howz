/******************
 * Sistema de Ligas para Pokemon Showdown
 * Original: Ecuacion
 * Actualización: Valent21 para Star
 * ***************/
 
'use strict';
 
const leagueDataFile = 'config/leaguedata.json';
const medalDataFile = 'config/medaldata.json';
 
function defaultData() {
    return {
        data: {},
        users: {},
    };
}
 
let fs = require('fs');
 
if (!fs.existsSync(leagueDataFile)) {
    fs.writeFileSync(leagueDataFile, '{}');
}
if (!fs.existsSync(medalDataFile)) {
    fs.writeFileSync(medalDataFile, JSON.stringify(defaultData()));
}
let league = JSON.parse(fs.readFileSync(leagueDataFile).toString());
let medal = JSON.parse(fs.readFileSync(medalDataFile).toString());
 
function writeLeagueData() {
    fs.writeFileSync(leagueDataFile, JSON.stringify(league));
}
 
function writeMedalData() {
    fs.writeFileSync(medalDataFile, JSON.stringify(medal));
}
 
function getAllMedals() {
    let list = '';
    for (let i in medal.data) {
        list += i + " | ";
    }
    return list;
};
 
function getMedalData(medalId) {
    medalId = toId(medalId);
    if (!medal.data[medalId]) return false;
    return {
        name: medal.data[medalId].name,
        image: medal.data[medalId].image,
        width: medal.data[medalId].width,
        height: medal.data[medalId].height,
    };
};
 
function findMedal(leader, leagueid) {
    leader = toId(leader);
    if (leagueid) {
        if (!league[leagueid]) return false;
        for (let j in league[leagueid].leaders) {
            if (toId(league[leagueid].leaders[j].user) === leader) return j;
        }
        return false;
    }
    for (let i in league) {
        for (let j in league[i].leaders) {
            if (toId(league[i].leaders[j].user) === leader) return j;
        }
    }
    return false;
};
 
function newMedal(medalId, name, image, w, h) {
    medalId = toId(medalId);
    if (medal.data[medalId]) return false;
    medal.data[medalId] = {
        name: name,
        image: image,
        width: parseInt(w),
        height: parseInt(h),
    };
    writeMedalData();
    return true;
};
 
function deleteMedal(medalId) {
    medalId = toId(medalId);
    if (!medal.data[medalId]) return false;
    delete medal.data[medalId];
    writeMedalData();
    return true;
};
 
function editMedal(medalId, param, data) {
    medalId = toId(medalId);
    if (!medal.data[medalId]) return false;
    switch (toId(param)) {
    case 'n':
        medal.data[medalId].name = data;
        break;
    case 'i':
        medal.data[medalId].image = data;
        break;
    case 'w':
        data = parseInt(data);
        if (!data) return false;
        medal.data[medalId].width = data;
        break;
    case 'h':
        data = parseInt(data);
        if (!data) return false;
        medal.data[medalId].height = data;
        break;
    }
    writeMedalData();
    return true;
};
 
function giveMedal(medalId, userId) {
    userId = toId(userId);
    medalId = toId(medalId);
    if (!medal.users[userId]) medal.users[userId] = {};
    if (!medal.data[medalId] || medal.users[userId][medalId]) return false;
    medal.users[userId][medalId] = 1;
    writeMedalData();
    return true;
};
 
function removeMedal(medalId, userId) {
    userId = toId(userId);
    medalId = toId(medalId);
    if (!medal.users[userId]) return false;
    if (!medal.users[userId][medalId]) return false;
    delete medal.users[userId][medalId];
    writeMedalData();
    return true;
};
 
function getMedalRaw(userId) {
    userId = toId(userId);
    if (!medal.users[userId]) return '<center><b>Sin medallas por el momento.</b></center>';
    let generic = '', leagueMedals = '';
    let registeredMedals = {};
    let aux, aux2;
    for (let i in league) {
        aux = ''; aux2 = '';
        for (let n in league[i].leaders) {
            if (medal.users[userId][n] && league[i].leaders[n].rank === "g") {
                aux += '<img src="' + encodeURI(medal.data[n].image) + '" title="' + Chat.escapeHTML(medal.data[n].name) + '" width="' + Chat.escapeHTML(medal.data[n].width) + '" height="' + Chat.escapeHTML(medal.data[n].height) + '" />&nbsp;';
                registeredMedals[n] = 1;
            } else if (medal.users[userId][n] && league[i].leaders[n].rank === "e") {
                aux2 += '<img src="' + encodeURI(medal.data[n].image) + '" title="' + Chat.escapeHTML(medal.data[n].name) + '" width="' + Chat.escapeHTML(medal.data[n].width) + '" height="' + Chat.escapeHTML(medal.data[n].height) + '" />&nbsp;';
                registeredMedals[n] = 1;
            }
        }
        if (aux !== '' && aux2 === '') {
            leagueMedals += "<h3>" + Chat.escapeHTML(league[i].name) + "</h3>" + aux + "<br />";
        } else if (aux === '' && aux2 !== '') {
            leagueMedals += "<h3>" + Chat.escapeHTML(league[i].name) + "</h3>" + aux2 + "<br />";
        } else if (aux !== '' && aux2 !== '') {
            leagueMedals += "<h3>" + Chat.escapeHTML(league[i].name) + "</h3>" + aux2 + "<br /><br />" + aux + "<br />";
        }
    }
    for (let j in medal.users[userId]) {
        if (!registeredMedals[j]) {
            generic += '<img src="' + encodeURI(medal.data[j].image) + '" title="' + Chat.escapeHTML(medal.data[j].name) + '" width="' + Chat.escapeHTML(medal.data[j].width) + '" height="' + Chat.escapeHTML(medal.data[j].height) + '" />&nbsp;';
        }
    }
    if (generic !== '') generic += "<br />";
    return "<center>" + generic + leagueMedals + "</center>";
};
 
function getMedalQuery(userId) {
    userId = toId(userId);
    if (!medal.users[userId]) return '<center><b>Sin medallas por el momento.</b></center>';
    let generic = '', leagueMedals = '';
    let registeredMedals = {};
    let aux, aux2;
    for (let i in league) {
        aux = ''; aux2 = '';
        for (let n in league[i].leaders) {
            if (medal.users[userId][n] && league[i].leaders[n].rank === "g") {
                aux += '<img src="' + encodeURI(medal.data[n].image) + '" title="' + Chat.escapeHTML(medal.data[n].name) + '" width="' + Chat.escapeHTML(medal.data[n].width) + '" height="' + Chat.escapeHTML(medal.data[n].height) + '" />&nbsp;';
                registeredMedals[n] = 1;
            } else if (medal.users[userId][n] && league[i].leaders[n].rank === "e") {
                aux2 += '<img src="' + encodeURI(medal.data[n].image) + '" title="' + Chat.escapeHTML(medal.data[n].name) + '" width="' + Chat.escapeHTML(medal.data[n].width) + '" height="' + Chat.escapeHTML(medal.data[n].height) + '" />&nbsp;';
                registeredMedals[n] = 1;
            }
        }
        if (aux !== '' && aux2 === '') {
            leagueMedals += "<h3>" + Chat.escapeHTML(league[i].name) + "</h3>" + aux + "<br />";
        } else if (aux === '' && aux2 !== '') {
            leagueMedals += "<h3>" + Chat.escapeHTML(league[i].name) + "</h3>" + aux2 + "<br />";
        } else if (aux !== '' && aux2 !== '') {
            leagueMedals += "<h3>" + Chat.escapeHTML(league[i].name) + "</h3>" + aux2 + "<br /><br />" + aux + "<br />";
        }
    }
    for (let j in medal.users[userId]) {
        if (!registeredMedals[j]) {
            generic += '<img src="' + encodeURI(medal.data[j].image) + '" title="' + Chat.escapeHTML(medal.data[j].name) + '" width="' + Chat.escapeHTML(medal.data[j].width) + '" height="' + Chat.escapeHTML(medal.data[j].height) + '" />&nbsp;';
        }
    }
    if (generic !== '') generic += "<br />";
    return "<center>" + generic + leagueMedals + "</center>";
};
 
function getAllLeagues() {
    let list = '';
    for (let i in league) {
        list += i + " | ";
    }
    return list;
};
 
function findLeagueFromName(leagueName) {
    let leagueNameId = toId(leagueName);
    for (let i in league) {
        if (toId(league[i].name) === leagueNameId) return i;
    }
    return false;
};
 
function findLeagueFromRoom(room) {
    let roomid = toId(room);
    for (let i in league) {
        if (toId(league[i].room) === roomid) return i;
    }
    return false;
};
 
function findLeague(data, room) {
    let leagueId = toId(data);
    if (league[leagueId]) return leagueId;
    leagueId = findLeagueFromName(data);
    if (leagueId) return leagueId;
    leagueId = findLeagueFromRoom(room);
    if (leagueId) return leagueId;
    return false;
};
 
function newLeague(leagueId, name, room) {
    leagueId = toId(leagueId);
    if (league[leagueId]) return false;
    league[leagueId] = {
        name: name,
        room: room,
        leaders: {},
    };
    writeLeagueData();
    return true;
};
 
function deleteLeague(leagueId) {
    leagueId = toId(leagueId);
    if (!league[leagueId]) return false;
    delete league[leagueId];
    writeLeagueData();
    return true;
};
 
function editLeague(leagueId, param, data) {
    leagueId = toId(leagueId);
    if (!league[leagueId]) return false;
    switch (toId(param)) {
    case 'n':
        league[leagueId].name = data;
        break;
    case 'r':
        league[leagueId].room = data;
        break;
    }
    writeLeagueData();
    return true;
};
 
function addLeader(leagueId, user, rank, medalId) {
    leagueId = toId(leagueId);
    medalId = toId(medalId);
    if (!league[leagueId] || league[leagueId].leaders[medalId] || !medal.data[medalId]) return false;
    league[leagueId].leaders[medalId] = {
        user: user,
        rank: rank,
    };
    writeLeagueData();
    return true;
};
 
function removeLeader(leagueId, medalId) {
    leagueId = toId(leagueId);
    medalId = toId(medalId);
    if (!league[leagueId] || !league[leagueId].leaders[medalId]) return false;
    delete league[leagueId].leaders[medalId];
    writeLeagueData();
    return true;
};
 
function getLeagueTable(leagueId) {
    if (!league[leagueId]) return 'La liga especificada no está registrada en el servidor';
    let html = '', medalHTML = '';
    let e = false, g = false, c = false;
    html += '<center><h2>' + league[leagueId].name + '</h2></center>';
    html += '<b>Sala:</b> <button name="send" value ="/join ' + league[leagueId].room + '">' + league[leagueId].room + '</button><br /><br />';
    html += '<b>Campeon:</b> ';
    for (let i in league[leagueId].leaders) {
        if (league[leagueId].leaders[i].rank === "c") {
            c = true;
            html += Server.nameColor(league[leagueId].leaders[i].user, true) + '&nbsp;&nbsp;';
            if (medal.data[i]) medalHTML += '<img src="' + encodeURI(medal.data[i].image) + '" title="' + Chat.escapeHTML(medal.data[i].name) + '" width="' + Chat.escapeHTML(medal.data[i].width) + '" height="' + Chat.escapeHTML(medal.data[i].height) + '" />&nbsp;';
        }
    }
    if (!c) html += '<i>(vacio)</i>';
    html += '<br /><b>Elite:</b> ';
    for (let i in league[leagueId].leaders) {
        if (league[leagueId].leaders[i].rank === "e") {
            e = true;
            html += Server.nameColor(league[leagueId].leaders[i].user, true) + '&nbsp;&nbsp;';
            if (medal.data[i]) medalHTML += '<img src="' + encodeURI(medal.data[i].image) + '" title="' + Chat.escapeHTML(medal.data[i].name) + '" width="' + Chat.escapeHTML(medal.data[i].width) + '" height="' + Chat.escapeHTML(medal.data[i].height) + '" />&nbsp;';
        }
    }
    if (!e) html += '<i>(vacio)</i>';
    html += '<br /><b>Lideres:</b> ';
    for (let i in league[leagueId].leaders) {
        if (league[leagueId].leaders[i].rank === "g") {
            g = true;
            html += Server.nameColor(league[leagueId].leaders[i].user, true) + '&nbsp;&nbsp;';
            if (medal.data[i]) medalHTML += '<img src="' + encodeURI(medal.data[i].image) + '" title="' + Chat.escapeHTML(medal.data[i].name) + '" width="' + Chat.escapeHTML(medal.data[i].width) + '" height="' + Chat.escapeHTML(medal.data[i].height) + '" />&nbsp;';
        }
    }
    if (!g) html += '<i>(vacio)</i>';
    html += '<br /><hr />' + medalHTML + '<br />';
    return html;
};
 
exports.commands = {
    ayudaliga: 'leaguehelp',
    leaguehelp: function (target, room, user) {
        return this.sendReplyBox(
            "<center><h3><b><u>Lista de Comandos para las Ligas</u></b></h3></center>" +
            "<br /><b>Comandos Usuales</b><br />" +
            "/medallas [user] - Muestra las medallas con las que cuenta un usuario.<br />" +
            "/liga [name] - Comando para mostrar la informacion más general de una liga (miembros y sala).<br />" +
            "/darmedalla [user] - Entrega una medalla como miembro de una liga.<br />" +
            "/quitarmedalla [user] - Retira una medalla como miembro de una liga.<br />" +
            "<br /><b>Comandos Administrativos</b><br />" +
            "/medallist - Muestra la lista de Ids de la base de datos de medallas.<br />" +
            "/medaldata [id] - Muestra una de las medallas por su ID.<br />" +
            "/addmedal [id], [name], [width], [height], [image] - Agrega una medalla al server.<br />" +
            "/deletemedal [id] - Elimina una medalla.<br />" +
            "/editmedal [id], [name/image/width/height], [data] - Modifica las propiedades de una medalla.<br />" +
            "/leaguelist - Muestra la lista de Ids de la base de datos de ligas.<br />" +
            "/addleague [id], [name], [room] - Comando para registrar una liga.<br />" +
            "/deleteleague [id] - Comando para eliminar una liga.<br />" +
            "/editleague [id], [name/room], [data] - Edita la informacion de la liga.<br />" +
            "/setgymleader [id-league], [user], [id-medal] - Establece un usuario como miembro de la liga.<br />" +
            "/setelite [id-league], [user], [id-medal] - Establece un usuario como elite de la liga.<br />" +
            "/setchampion [id-league], [user], [id-medal] - Establece un usuario como champion de la liga.<br />" +
            "/removemember [id-league], [id-medal] - Elimina un puesto de una liga.<br />" +
            "/darmedalla [user], (id) - Entrega una medalla.<br />" +
            "/quitarmedalla [user], (id) - Retira una medalla.<br />"
        );
    },
 
    medallist: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        return this.sendReplyBox("Medallas (ID): " + getAllMedals());
    },
 
    medaldata: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        if (!target) return this.sendReply("No has especificado ninguna medalla.");
        let medalData = getMedalData(target);
        if (!medalData) return this.sendReply("La medalla especificada no existe.");
        return this.sendReplyBox('<b>' + Chat.escapeHTML(medalData.name) + ':</b><br /><img src="' + encodeURI(medalData.image) + '" title="' + Chat.escapeHTML(medalData.name) + '" width="' + Chat.escapeHTML(medalData.width) + '" height="' + Chat.escapeHTML(medalData.height) + '" />&nbsp;');
    },
 
    newmedal: 'addmedal',
    addmedal: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        if (!target) return this.sendReply("No has especificado ninguna medalla.");
        let params = target.split(',');
        if (!params || params.length < 5) return this.sendReply("Usage: /addmedal [id], [name], [width], [height], [image]");
        if (newMedal(params[0], params[1], params[4], params[2], params[3])) return this.sendReply("Medalla: " + toId(params[0]) + " creada con exito.");
        this.sendReply("La medalla especificada ya existía.");
    },
 
    deletemedal: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        if (!target) return this.sendReply("No has especificado ninguna medalla.");
        if (deleteMedal(target)) return this.sendReply("Medalla: " + toId(target) + " eliminada con exito.");
        this.sendReply("La medalla especificada no existe.");
    },
 
    medaledit: 'editmedal',
    editmedal: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        if (!target) return this.sendReply("No has especificado ninguna medalla.");
        let params = target.split(',');
        if (!params || params.length < 3) return this.sendReply("Usage: /editmedal [id], [name/image/width/height], [data]");
        let opc = toId(params[1]).substr(0, 1);
        if (editMedal(params[0], opc, params[2])) return this.parse("/medaldata " + params[0]);
        this.sendReply("Alguno de los datos no es correcto.");
    },
 
    medals: 'medallas',
    vermedallas: 'medallas',
    medallas: function (target, room, user) {
        if (!this.runBroadcast()) return false;
        let targetUser = toId(user.name);
        if (target) targetUser = toId(target);
        let userT = Users.get(targetUser);
        if (userT) {
            userT = userT.name;
        } else {
            userT = targetUser;
        }
        let html = '<center><h2>Medallas de ' + userT + '</h2><center>';
        html += getMedalRaw(userT);
        return this.sendReplyBox(html);
    },
 
    leaguemedal: 'medallaliga',
    medallaliga: function (target, room, user) {
        if (!this.runBroadcast()) return false;
        let targetUser = toId(user.name);
        if (target) targetUser = toId(target);
        let userT = Users.get(targetUser);
        if (userT) {
            userT = userT.name;
        } else {
            userT = targetUser;
        }
        let medalId = findMedal(userT);
        if (medalId) return this.sendReply(userT + " no es miembro de ninguna liga del servidor.");
        let medalData = getMedalData(medalId);
        if (!medalData) return this.sendReply("La medalla especificada no existe.");
        return this.sendReplyBox(userT + ' puede hacer entrega de: <b>' + Chat.escapeHTML(medalData.name) + ':</b><br /><br /><img src="' + encodeURI(medalData.image) + '" title="' + Chat.escapeHTML(medalData.name) + '" width="' + Chat.escapeHTML(medalData.width) + '" height="' + Chat.escapeHTML(medalData.height) + '" />&nbsp;');
    },
 
    qmedals: function (target, room, user, connection) {
        //low level commmand
        if (Config.emergency && this.adminlog(connection.ip, user.name)) return false;
        connection.send('|queryresponse|userdetails|' + JSON.stringify({
            medals: getMedalQuery(user.name),
        }));
        return false;
    },
 
    league: 'liga',
    lideres: 'liga',
    liga: function (target, room, user) {
        if (!this.runBroadcast()) return false;
        let leagueId = findLeague(target, room.id);
        if (!leagueId) return this.sendReply("La liga especificada no está registrada en el servidor.");
        return this.sendReplyBox(getLeagueTable(leagueId));
    },
 
    leaguelist: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        return this.sendReplyBox("Ligas (ID): " + getAllLeagues());
    },
 
    newleague: 'addleague',
    addleague: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        if (!target) return this.sendReply("No has especificado ninguna liga.");
        let params = target.split(',');
        if (!params || params.length < 3) return this.sendReply("Usage: /addleague [id], [name], [room]");
        if (newLeague(params[0], params[1], params[2])) return this.sendReply("Liga: " + toId(params[0]) + " creada con exito.");
        this.sendReply("La liga especificada ya existía.");
    },
 
    deleteleague: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        if (!target) return this.sendReply("No has especificado ninguna liga.");
        if (deleteLeague(target)) return this.sendReply("Liga: " + toId(target) + " eliminada con exito.");
        this.sendReply("La liga especificada no existe.");
    },
 
    eleague: 'editleague',
    editleague: function (target, room, user) {
        if (!this.can("hotpatch")) return false;
        if (!target) return this.sendReply("No has especificado ninguna liga.");
        let params = target.split(',');
        if (!params || params.length < 3) return this.sendReply("Usage: /editleague [id], [name/room], [data]");
        let opc = toId(params[1]).substr(0, 1);
        if (editLeague(params[0], opc, params[2])) return this.parse("/liga " + params[0]);
        this.sendReply("Alguno de los datos no es correcto.");
    },
 
    setgymleader: function (target, room, user) {
        if (!this.can('hotpatch')) return false;
        if (!target) return this.sendReply('Usage: /setgymleader [id-league], [user], [id-medal]');
        let params = target.split(',');
        if (!params || params.length < 3) return this.sendReply("Usage: /setgymleader [id-league], [user], [id-medal]");
        if (!Users.get(params[1])) this.sendReply('Warning: ' + toId(params[1]) + ' is offline.');
        if (addLeader(params[0], params[1], 'g', params[2])) return this.sendReply('Usuario ' + toId(params[1]) + ' asignado en el puesto correspondiente.');
        this.sendReply("Alguno de los datos no es correcto.");
    },
 
    setelite: function (target, room, user) {
        if (!this.can('hotpatch')) return false;
        if (!target) return this.sendReply('Usage: /setelite [id-league], [user], [id-medal]');
        let params = target.split(',');
        if (!params || params.length < 3) return this.sendReply("Usage: /setelite [id-league], [user], [id-medal]");
        if (!Users.get(params[1])) this.sendReply('Warning: ' + toId(params[1]) + ' is offline.');
        if (addLeader(params[0], params[1], 'e', params[2])) return this.sendReply('Usuario ' + toId(params[1]) + ' asignado en el puesto correspondiente.');
        this.sendReply("Alguno de los datos no es correcto.");
    },
 
    setchampion: function (target, room, user) {
        if (!this.can('hotpatch')) return false;
        if (!target) return this.sendReply('Usage: /setchampion [id-league], [user], [id-medal]');
        let params = target.split(',');
        if (!params || params.length < 3) return this.sendReply("Usage: /setchampion [id-league], [user], [id-medal]");
        if (!Users.get(params[1])) this.sendReply('Warning: ' + toId(params[1]) + ' is offline.');
        if (addLeader(params[0], params[1], 'c', params[2])) return this.sendReply('Usuario ' + toId(params[1]) + ' asignado en el puesto correspondiente.');
        this.sendReply("Alguno de los datos no es correcto.");
    },
 
    removemember: function (target, room, user) {
        if (!this.can('hotpatch')) return false;
        if (!target) return this.sendReply('Usage: /removemember [id-league], [id-medal]');
        let params = target.split(',');
        if (!params || params.length < 2) return this.sendReply("Usage: /removemember [id-league], [id-medal]");
        if (removeLeader(params[0], params[1])) return this.sendReply('Puesto de la liga especificada borrado con exito.');
        this.sendReply("Alguno de los datos no es correcto.");
    },
 
    givemedal: 'darmedalla',
    concedemedal: 'darmedalla',
    darmedalla: function (target, room, user) {
        if (!target) return this.sendReply('Usage: /darmedalla [user], (id)');
        let params = target.split(',');
        if (params.length === 1) {
            let userT = Users.get(params[0]);
            if (!userT) return this.sendReply('El usuario ' + toId(target) + ' no existe o no está disponible.');
            let league = findLeagueFromRoom(room.id);
            if (!league) return this.sendReply('Este comando solo puede ser usado en la Sala correspondiente a la liga.');
            let medalId = findMedal(user.name, league);
            if (!medalId) return this.sendReply('No estas registrado como miembro de la liga ' + league);
            let medalData = getMedalData(medalId);
            if (!giveMedal(medalId, params[0])) return this.sendReply('El usuario ya poseía la medalla que intentas entregar.');
            userT.popup(user.name + " te ha entregado la siguiente medalla: " + medalData.name + "\nRecuerda que puedes comprar tus medallas con el comando /medallas");
            this.addModAction(user.name + " ha entregado su medalla (" + medalData.name + ") a " + toId(target) + '.');
            return;
        } else if (params.length > 1) {
            if (!this.can('broadcast')) return false;
            let userT = Users.get(params[0]);
            if (!userT) return this.sendReply('El usuario ' + toId(params[0]) + ' no existe o no está disponible.');
            if (!giveMedal(params[1], params[0])) return this.sendReply('El usuario ya poseía dicha medalla o el Id es incorrecto.');
            return this.sendReply('Medalla (' + getMedalData(params[1]).name + ') entregada a ' + toId(params[0]) + '.');
        }
        return this.sendReply('Usage: /darmedalla [user], (id)');
    },
 
    removemedal: 'quitarmedalla',
    quitarmedalla: function (target, room, user) {
        if (!target) return this.sendReply('Usage: /quitarmedalla [user], (id)');
        let params = target.split(',');
        if (params.length === 1) {
            let league = findLeagueFromRoom(room.id);
            if (!league) return this.sendReply('Este comando solo puede ser usado en la Sala correspondiente a la liga.');
            let medalId = findMedal(user.name, league);
            if (!medalId) return this.sendReply('No estas registrado como miembro de la liga ' + league);
            if (!removeMedal(medalId, params[0])) return this.sendReply('El usuario ya poseía la medalla que intentas entregar.');
            this.addModAction(user.name + " ha retirado su medalla a " + toId(target) + '.');
            return;
        } else if (params.length > 1) {
            if (!this.can('broadcast')) return false;
            if (!removeMedal(params[1], params[0])) return this.sendReply('El usuario no poseía dicha medalla o el Id es incorrecto.');
            return this.sendReply('Medalla (' + getMedalData(params[1]).name + ') retirada a ' + toId(params[0]) + '.');
        }
        return this.sendReply('Usage: /quitarmedalla [user], (id)');
    },
};
