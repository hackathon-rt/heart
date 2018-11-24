const fetch = require('node-fetch');
global.Headers = fetch.Headers;
const dbConnect = require('./dbConnect');

let base64 = require('base-64');
let username = 'aliasxrus';
let password = '123456';

let headers = new Headers();
headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));

exports.dataAdmHmao = async function (dataId, city) {
    let {Items: organizations} = await fetch(`https://data.admhmao.ru/api/data/index.php?id=${dataId}`, {
        method: 'GET',
        headers: headers
    })
        .then(response => response.json());

    for (const organization of organizations) {
        let contacts_id = '';
        let url = '';
        let orgName = '';
        if (city === 'Когалым') {
            url = `https://geocode-maps.yandex.ru/1.x/?format=json&rspn=1&ll=72.59026200,62.36096697&spn=26.56140426,7.14821063&results=1&geocode=Когалым, ${organization.Cells.ADRES_MESTONAKHOZHDENIYA}`;
            orgName = organization.Cells.NAIMENOVANIE;
        } else {
            url = `https://geocode-maps.yandex.ru/1.x/?format=json&rspn=1&ll=72.59026200,62.36096697&spn=26.56140426,7.14821063&results=1&geocode=${organization.Cells.POCHTOVYY_ADRES_MESTONAKHOZHDENIE_POSTOY}`;
            orgName = organization.Cells.NAIMENOVANIE_POSTOYANNO_DEYSTVUYUSHCHEGO;
        }
        await fetch(encodeURI(url))
            .then(response => {
                return response.json();
            })
            .then(async json => {
                if (await dbConnect.queryDB(`SELECT * FROM public.contacts WHERE name = '${orgName}'`)
                    .then(result => {
                        return result.rows.length === 0;
                    })) {
                    await dbConnect.queryDB(`SELECT uuid_generate_v4()`)
                        .then(({rows: {['0']: {uuid_generate_v4: uuid}}}) => {
                            contacts_id = uuid;
                        })
                        .then(() => {
                            const [longitude, latitude] = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
                            return dbConnect.queryDB(`INSERT INTO public.contacts (contacts_id, name, longitude, latitude, address)
                                                      VALUES ('${contacts_id}', '${orgName}', '${longitude}', '${latitude}', '${json.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text}');`);
                        });
                    const users_id = await dbConnect.queryDB(`SELECT uuid_generate_v4()`)
                        .then(({rows: {['0']: {uuid_generate_v4: uuid}}}) => {
                            return uuid;
                        });
                    await dbConnect.queryDB(`INSERT INTO users (users_id, username, password, salt, is_enabled, is_deleted)
                                              VALUES ('${users_id}', 'user_${users_id.split('-')[0]}', 'pass', md5(concat('pass', 'salt')), true, false);`);
                    const parnter_id = await dbConnect.queryDB(`SELECT uuid_generate_v4()`)
                        .then(({rows: {['0']: {uuid_generate_v4: uuid}}}) => {
                            return uuid;
                        });
                    await dbConnect.queryDB(`INSERT INTO partners (partners_id, users_id)
                                             VALUES ('${parnter_id}', '${users_id}');`);
                    await dbConnect.queryDB(`INSERT INTO public.partners_contacts (contacts_id, partners_id, is_main)
                                             VALUES ('${contacts_id}', '${parnter_id}', true);`);
                }
            });

    }
};

exports.startDataApi = async function () {
    module.exports.dataAdmHmao('842546', 'Нягань');
    module.exports.dataAdmHmao('1399475', 'Когалым');
};

//module.exports.startDataApi();


