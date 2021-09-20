"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {};
        this.query = this.query.find(Object.assign({}, keyword));
        return this;
    }
    filter() {
        let queryCopy = Object.assign({}, this.queryStr);
        const removeField = ['keyword', 'limit', 'page'];
        removeField.forEach(field => delete queryCopy[field]);
        queryCopy = JSON.stringify(queryCopy);
        queryCopy = queryCopy.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        queryCopy = this.query.find(JSON.parse(queryCopy));
        return this;
    }
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const toSkip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(toSkip);
        return this;
    }
}
exports.ApiFeatures = ApiFeatures;
//# sourceMappingURL=apiFeatures.js.map