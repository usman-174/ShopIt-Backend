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
        const defaultQuery = {
            keyword: '',
            page: '1',
            price: { lte: '1000', gte: '1' },
            ratings: { gte: '0' }
        };
        if (defaultQuery === this.queryStr) {
            this.query = this.query.find();
            return this;
        }
        const queryCopy = Object.assign({}, this.queryStr);
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}
exports.ApiFeatures = ApiFeatures;
//# sourceMappingURL=apiFeatures.js.map