'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    request = require('request'),
    soap = require('soap'),
    fs = require('fs'),
    Walkin = mongoose.model('Walkin');

// Get credentials (& reformat wsdl url)
var credentialFilePath = __dirname + '/../credentials/ServiceNow.json',
    credentialFile = fs.readFileSync(credentialFilePath, 'utf8'),
    credential = JSON.parse(credentialFile);

if(credential.username){
    var index = credential.wsdl_url.indexOf('//') + '//'.length;
    credential.wsdl_url = credential.wsdl_url.substring(0, index) + credential.username + ':' + credential.password + '@' + credential.wsdl_url.substring(index);
}

var popOpt = [
    { path : 'user', model : 'User', select : 'username'},
    { path : 'lastUpdateTechnician', model : 'User', select : 'username'},
    { path : 'serviceTechnician', model : 'User', select : 'username'},
    { path : 'resoluteTechnician', model : 'User', select : 'username'}
];

var getTemplateShortDescription = function(walkin){
    var prefix = 'CR: ';

    return prefix + 'Dummy Template';
};

var formulateWalkin = function(walkin, soapAction){
    var SNObj = {
        // Request info
        u_soapaction : soapAction,
        u_incident_state : 'Resolved',

        // Static info
        category_1 : 'Desktop Management',
        configuration_item : 'Student Technology',
        impact : '4 – Minor/Localized',
        suppress_notification : 'Yes',
        urgency : '4 - Low',

        // Walk-in info
        record_type:  'Incident',
        reported_source :  'Walk In',
        short_description : getTemplateShortDescription(walkin),

        // Assignment info
        u_assigned_to : walkin.serviceTechnician.username,
        u_assignment_group : 'LITS: Student Digital Life',

        // Time log
        u_duration : walkin.resolutionTime.getTime() - walkin.created.getTime(),
        u_time_worked : walkin.resolutionTime.getTime() - walkin.serviceStartTime.getTime()
    };

    console.log(SNObj);
    return SNObj;
};

exports.getWalkinIncident = function(id){

};

exports.createWalkinIncident = function(walkin){
    var data = {
        u_soapaction : 'CREATE',
        u_record_type : 'Test Incident',
        u_short_description : 'This is a test incident submitted by STS MEAN stack application',
        u_assignment_group : 'LITS: Student Digital Life'
    };

    Walkin.findOne({ _id : 15 }).populate(popOpt).exec(function(err, result){
        if(err) return console.log(err);
        formulateWalkin(result, 'CREATE');
    });

    //soap.createClient(credential.wsdl_url, function(err, client){
    //    if(err) return console.log(err);
    //    client.setSecurity(new soap.BasicAuthSecurity(credential.username, credential.password));
    //
    //    client.insert(data, function(err, response){
    //        if(err) return console.log(err);
    //        console.log(response);
    //
    //        walkin.snSysId = response.sys_id;
    //        walkin.snValue = response.display_name;
    //        walkin.save(function(err, updatedWalkin){
    //            if(err) return console.log(err);
    //            return updatedWalkin;
    //        });
    //    });
    //});
};

exports.updateWalkinIncident = function(walkin){

};
