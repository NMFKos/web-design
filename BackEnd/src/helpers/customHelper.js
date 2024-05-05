const handlebars = require('handlebars');

handlebars.registerHelper('eq', function(a, b, options) {
    if (a === b) {
        return options.fn(this);
    } else if (typeof options.inverse === 'function') {
        return options.inverse(this);
    }
});

// Định nghĩa các helper tùy chỉnh khác nếu cần
