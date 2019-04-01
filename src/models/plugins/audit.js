module.exports = function timestamp(schema, userId) {
    schema.add({
        createdBy: String,
        updatedBy: String
    });
    schema.pre('save', function () {
        this.createdBy = userId;
        next();
    });
    schema.pre('update', function () {
        this.updatedBy = userId;
        next();
    });
}