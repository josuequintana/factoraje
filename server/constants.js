var consts = {};

consts.CLIENT_ID = 'osigu_dashboard_providers';
consts.CLIENT_SECRET = 'a1f9ed06-7f4c-4834-a6d1-a5873f6403e2'
consts.AUTH_TOKEN = '';

consts.setToken = function(token) {
    consts.AUTH_TOKEN = token;
};

module.exports = consts;