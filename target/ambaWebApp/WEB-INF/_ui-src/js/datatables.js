$.ajaxSetup({
    async: false
});

let CURRENT_STATE_API = 'https://amba-tst-api-app.azurewebsites.net/UIUsers/GetCurrentState?vipId=';
let DEVICES_API = 'https://amba-tst-api-app.azurewebsites.net/UIUsers/GetDevices?vipId=';
let NOTIFICATION_HISTORY_API = 'https://amba-tst-api-app.azurewebsites.net/UIUsers/GetNotificationHistory?vipId=';
let USERS_API = 'https://amba-tst-api-app.azurewebsites.net/UIUsers/GetUsers?vipId=';
let PARAMS_API = 'https://amba-tst-api-app.azurewebsites.net/UIUsers/GetParams?vipId=';
let RAW_DATA_API = 'https://amba-tst-api-app.azurewebsites.net/UIUsers/GetRawData?vipId=';
let RULES_API = 'https://amba-tst-api-app.azurewebsites.net/UIUsers/GetRules?vipId=';

$(document).ready(function () {

    let defaultvipID = 1;
    if (localStorage.getItem("previousVIPID") != null) {
        defaultvipID = localStorage.getItem("previousVIPID");
    }

    let currentStateTable = getDataTableInstance(CURRENT_STATE_API + defaultvipID, 'currentState');
    let devicesTable = getDataTableInstance(DEVICES_API + defaultvipID, 'devices');
    let notificationHistoryTable = getDataTableInstance(NOTIFICATION_HISTORY_API + defaultvipID, 'notificationHistory');
    let usersTable = getDataTableInstance(USERS_API + defaultvipID, 'users');
    let paramsTable = getDataTableInstance(PARAMS_API + defaultvipID, 'params');
    let rawDataTable = getDataTableInstance(RAW_DATA_API + defaultvipID, 'rawData');
    let rulesTable = getDataTableInstance(RULES_API + defaultvipID, 'rules');

    $('.js-example-basic-single').on("change", function (e) {
        let vipID = $('.js-example-basic-single').val();

        currentStateTable = redrawTable(CURRENT_STATE_API + vipID, currentStateTable, 'currentState');
        devicesTable = redrawTable(DEVICES_API + vipID, devicesTable, 'devices');
        notificationHistoryTable = redrawTable(NOTIFICATION_HISTORY_API + vipID, notificationHistoryTable, 'notificationHistory');
        usersTable = redrawTable(USERS_API + vipID, usersTable, 'users');
        paramsTable = redrawTable(PARAMS_API + vipID, paramsTable, 'params');
        rawDataTable = redrawTable(RAW_DATA_API + vipID, rawDataTable, 'rawData');
        rulesTable = redrawTable(RULES_API + vipID, rulesTable, 'rules');

        $(".current-vip-id").text("Current VIP ID: " + vipID);
        localStorage.setItem("previousVIPID", vipID);
    });

    $(".current-vip-id").text("Current VIP ID: " + defaultvipID);
});

function getJSONfromAPI(apiUrl) {
    let my_columns = [];
    let my_data = [];

    $.getJSON(apiUrl, function (data) {
        let columns = [];

        if (data.length > 0) {
            $.each(data[0], function (key, value) {
                let my_item = {};
                my_item.data = key;
                my_item.title = key;
                columns.push(my_item);
            });
        }

        my_data = data;
        my_columns = columns;

    });
    return {my_columns, my_data};
}

function getDataTableInstance(apiUrl, tableId) {
    let {my_columns, my_data} = getJSONfromAPI(apiUrl);

    if (my_data.length > 0) {
        $('#' + tableId + ' thead').remove();

        return $('#' + tableId).DataTable({
            data: my_data,
            "columns": my_columns
        });
    }

    return $('#' + tableId).DataTable();
}

function redrawTable(apiUrl, table, tableId) {
    let {my_columns, my_data} = getJSONfromAPI(apiUrl);
    table.destroy();
    $('#' + tableId).empty();

    if (my_data.length > 0) {
        $('#' + tableId + ' thead').remove();
        return $('#' + tableId).DataTable({
            columns: my_columns,
            data: my_data
        });
    }

    $('#' + tableId).html('<thead>\n' +
        '                            <tr>\n' +
        '                                <th>No data found for this VIP ID</th>\n' +
        '                            </tr>\n' +
        '                            </thead>');

    return $('#' + tableId).DataTable();
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});