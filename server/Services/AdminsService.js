'use strict';

var Admin = require('../Models/Admin').model;
var bcrypt = require('bcrypt');

/**
 * Create new admin
 *
 * @param adminData
 * @param callback
 * @return void
 */
function createAdmin(adminData, callback)
{
    adminData.password = bcrypt.hashSync(adminData.password, 10);

    var admin = new Admin(adminData);

    admin.save(function(err){
        if(err){
            return callback(true, err);
        }

        var result = {
            id : admin._id,
            first_name: admin.first_name,
            last_name: admin.last_name,
            email: admin.email
        };

        callback(false, result);
    });
}

/**
 * Update admin info
 *
 * @param adminId
 * @param adminData
 * @param callback
 */
function updateAdmin(adminId, adminData, callback)
{
    Admin.findByIdAndUpdate(adminId, { $set: adminData }, { new: true, runValidators: true }, function(err, admin){
        if(err) {
            return callback(true, 'Error while confirm admin, Please contact system administrator');
        }

        if(admin){
            var result = {
                id : admin._id,
                first_name: admin.first_name || '',
                last_name: admin.last_name || '',
                email: admin.email
            };

            callback(false, result);
        } else {
            callback(true, 'nothing update');
        }
    });
}

/**
 * Get admin by ID
 *
 * @param adminId
 * @param callback
 */
function getAdminById(adminId, callback)
{
    Admin.findById(adminId, function(err, admin){
        if(err) { return callback(true, 'Error while getting admin info'); }

        if(!admin) { callback(true, 'Admin not found') }

        return callback(false, admin);
    });
}

/**
 * Get admin by ID
 *
 * @param email
 * @param callback
 */
function getAdminByEmail(email, callback)
{
    Admin.find({email: email}, function(err, admin){
        if(err) { return callback(true, 'Error while getting admin info'); }

        if(!admin) { callback(true, 'Admin not found') }

        return callback(false, admin[0]);
    });
}

/**
 * Get list of admins
 *
 * @param criteria
 * @param callback
 */
function getList(criteria, callback)
{
    var per_page = 20;
    var offset = 0;
    var page = 1;
    var options = {};
    var projection = {
        password: 0
    };

    if(criteria.all && criteria.all == true){
        delete criteria.all;
    }else{
        if(criteria.page && criteria.page > 0) {
            page = parseInt(criteria.page);
            delete criteria.page;
        }

        offset = (page - 1) * per_page;

        options = {
            skip: offset,
            limit: per_page
        }
    }

    // TODO Check limit
    Admin.find(criteria, projection, options, function(err, admins){
        if(err) {
            return callback(true, "Error while getting list of admins");
        }

        return callback(false, admins);
    });
}

module.exports = {
    createAdmin: createAdmin,
    updateAdmin: updateAdmin,
    getAdminById: getAdminById,
    getList: getList,
    getAdminByEmail: getAdminByEmail
};